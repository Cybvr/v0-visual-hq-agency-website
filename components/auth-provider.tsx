"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut, type User } from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"
import { getUser, upsertUserOnLogin, type AppUser, type UserRole } from "@/lib/users"

/** sessionStorage key holding the uid an admin is currently "viewing as". */
const VIEW_AS_KEY = "viewAsUid"

type AuthContextValue = {
  user: User | null
  /**
   * The Firestore user doc data consumers should read (tasks/projects are
   * scoped by `appUser.clientId`). When an admin is viewing as a client this is
   * the *target* client's doc; otherwise it's the signed-in user's own doc.
   */
  appUser: AppUser | null
  /** Role from the signed-in user's own doc — unaffected by "view as". */
  role: UserRole | null
  loading: boolean
  isAdmin: boolean
  /** True when an admin is previewing the dashboard as another user. */
  isImpersonating: boolean
  /** The user being previewed, when impersonating. */
  impersonatedUser: AppUser | null
  /** Admin-only: start previewing the app as `target`. */
  viewAsUser: (target: AppUser) => void
  /** Stop previewing and return to the admin's own account. */
  stopViewingAs: () => void
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  // The signed-in user's own doc. Auth/role checks always use this.
  const [realAppUser, setRealAppUser] = useState<AppUser | null>(null)
  // The doc of the user an admin is "viewing as", if any.
  const [impersonated, setImpersonated] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (u) {
        try {
          const doc = await upsertUserOnLogin({
            uid: u.uid,
            email: u.email,
            displayName: u.displayName,
            photoURL: u.photoURL,
          })
          setRealAppUser(doc)

          // Restore a "view as" selection made before navigating here. Only
          // admins can impersonate, and never themselves.
          const viewAsUid = typeof window !== "undefined" ? sessionStorage.getItem(VIEW_AS_KEY) : null
          if (doc?.role === "admin" && viewAsUid && viewAsUid !== u.uid) {
            try {
              setImpersonated(await getUser(viewAsUid))
            } catch {
              setImpersonated(null)
            }
          } else {
            setImpersonated(null)
          }
        } catch (error) {
          console.error("Error provisioning user:", error)
          setRealAppUser(null)
          setImpersonated(null)
        }
      } else {
        setRealAppUser(null)
        setImpersonated(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function signInWithGoogle() {
    await signInWithPopup(auth, googleProvider)
  }

  async function signOut() {
    sessionStorage.removeItem(VIEW_AS_KEY)
    setImpersonated(null)
    await firebaseSignOut(auth)
  }

  const role = realAppUser?.role ?? null
  const isAdmin = role === "admin"
  const isImpersonating = isAdmin && impersonated !== null

  function viewAsUser(target: AppUser) {
    if (!isAdmin) return
    sessionStorage.setItem(VIEW_AS_KEY, target.uid)
    setImpersonated(target)
  }

  function stopViewingAs() {
    sessionStorage.removeItem(VIEW_AS_KEY)
    setImpersonated(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        appUser: isImpersonating ? impersonated : realAppUser,
        role,
        loading,
        isAdmin,
        isImpersonating,
        impersonatedUser: isImpersonating ? impersonated : null,
        viewAsUser,
        stopViewingAs,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}
