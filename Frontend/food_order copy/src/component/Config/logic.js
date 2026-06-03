export const isPresentInFavorites = (favorites, restaurant) => {
    if (!Array.isArray(favorites)) {
        favorites = []; // fallback to an empty array if favorites is not iterable
    }

    for (let item of favorites) {
        if (restaurant.id === item.id) {
            return true;
        }
    }
    return false;
}
