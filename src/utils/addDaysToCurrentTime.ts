const addDaysToCurrentTime = (days: number) => {
  const currentTimeInSeconds = Math.floor(Date.now() / 1000)
  const secondsInDay = 86400
  return currentTimeInSeconds + days * secondsInDay
}

export default addDaysToCurrentTime
