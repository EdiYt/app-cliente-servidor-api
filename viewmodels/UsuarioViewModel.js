class UsersViewModel {
    constructor() {
        this.users = [];
        this.currentUserId = null;
    }

    // Mapeo
    mapUserData(user) {
        return {
            id: user.id,
            nombre: user.nombre,
            email: user.email,
        };
    }
}

module.exports = UsersViewModel;