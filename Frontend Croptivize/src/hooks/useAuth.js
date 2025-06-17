const useAuth = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const accessToken = localStorage.getItem('accessToken');

    return { user, accessToken, isAuthenticated: !!user };
};

export default useAuth;
