// Re-export useAuth from AuthContext to maintain existing import paths
import { useAuth } from '../contexts/AuthContext';

export { useAuth };
export default useAuth;