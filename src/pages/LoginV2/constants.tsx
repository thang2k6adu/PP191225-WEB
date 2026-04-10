import { FaGoogle, FaFacebook, FaGithub } from 'react-icons/fa';

export const SOCIAL_PROVIDERS = [
  {
    id: 'google',
    icon: <FaGoogle size={24} color="white" />,
    label: 'Sign in with Google',
  },
  {
    id: 'facebook',
    icon: <FaFacebook size={24} color="white" />,
    label: 'Sign in with Facebook',
  },
  {
    id: 'github',
    icon: <FaGithub size={24} color="white" />,
    label: 'Sign in with GitHub',
  },
];
