export const getDay = () => {
  const now = new Date()
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
  const currentDate = localDate.toISOString().split("T")[0]
  return currentDate
}
