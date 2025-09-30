
export function getToken() {
	const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const { token } = JSON.parse(storedUser);
	  return token
	}
	return null
}