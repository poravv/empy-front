
export const Logout = () => {
    window.localStorage.removeItem('loggedEmpyUser');
    // eslint-disable-next-line
    window.location.href = window.location.href;
}