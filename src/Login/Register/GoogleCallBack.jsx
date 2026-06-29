import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"

const GoogleCallback = ({ setUser }) => {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const userParam = params.get("user")

    if (userParam) {
      const user = JSON.parse(decodeURIComponent(userParam))

      // save login state
      localStorage.setItem("user", JSON.stringify(user))
      setUser(user)

      // redirect to app
      navigate("/home")
    } else {
      navigate("/login")
    }
  }, [])

  return <p>Logging you in...</p>
}

export default GoogleCallback