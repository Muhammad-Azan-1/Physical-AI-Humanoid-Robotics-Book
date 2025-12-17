import React from 'react';
import NavbarItem from '@theme-original/NavbarItem';
import UserProfileNavbarItem from '@site/src/components/UserProfileNavbarItem';
import { useAuth } from '@site/src/hooks/useAuth';

export default function NavbarItemWrapper(props) {
    const { isAuthenticated } = useAuth();

    // If authenticated, hide the static Sign In / Sign Up buttons
    if (isAuthenticated && (props.to === '/signin' || props.to === '/signup')) {
        return null;
    }

    // If it's the custom profile item:
    // - Show it only if authenticated
    // - Hide it if not authenticated
    if (props.type === 'custom-profile') {
        if (!isAuthenticated) return null;
        return <UserProfileNavbarItem {...props} />;
    }

    // Default behavior for everything else
    // (including standard items when unauthenticated, and other navbar items)
    return <NavbarItem {...props} />;
}
