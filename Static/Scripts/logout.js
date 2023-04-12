const logout = () => {
  const FORM = document.createElement("form")
  FORM.method = "POST"
  FORM.action = "/auth/logout"
  document.body.appendChild(FORM)
  FORM.submit()
}
