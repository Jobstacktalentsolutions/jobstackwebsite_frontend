import { Suspense } from 'react'
import SignUp from './signup'

// This component passed as a fallback to the Suspense boundary
// will be rendered in place of the search bar in the initial HTML.
// When the value is available during React hydration the fallback
// will be replaced with the `<SearchBar>` component.
function SearchBarFallback() {
  return <>placeholder</>
}

export default function Page() {
  return (
    <>
      <nav>
        <Suspense fallback={ null}>
          <SignUp />
        </Suspense>
      </nav>
      <h1>Dashboard</h1>
    </>
  )
}