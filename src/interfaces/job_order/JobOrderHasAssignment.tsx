export interface JobOrderHasAssignment {
    UUID: string,
    jobID: string,
    pickupLocation: string,
    pickupAddress: string,
    deliveryLocation: string,
    deliveryAddress: string,
    startPickupAt: string,
    endPickupAt: string
}