export function getOrderStatus(order) {
    return order.pickedUpAt ? "Picked up" : order.readyAt ? "Ready for pickup" : order.preparedAt ? "Prepared" : "Created";
}
export function formatInstant(instant) {
    if (!instant)
        return "Not yet updated";
    return instant.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    });
}
export function formatRealtimeStamp(timestamp) {
    return new Date(timestamp).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    });
}
