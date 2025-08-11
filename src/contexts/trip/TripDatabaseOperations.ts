
// Re-export all operations from the new modular structure
export { fetchTripsFromDatabase, fetchTripsCount } from './operations/tripFetch';
export { insertTripToDatabase } from './operations/tripCreate';
export { updateTripInDatabase } from './operations/tripUpdate';
export { deleteTripFromDatabase } from './operations/tripDelete';
