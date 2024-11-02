export const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(price)
}

export const capitalize = (str: string) => {
    return str ? `${str[0].toUpperCase()}${str.slice(1)}` : "";
};