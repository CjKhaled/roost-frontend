// \src\components\headers\NavLinksCustom.js

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "../../store/store";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import Header, { LogoLink, NavLinks, NavLink as NavLinkBase } from "../headers/light.js";

const StyledHeader = styled(Header)`
  ${tw`justify-between`}
  ${LogoLink} {
    ${tw`mr-8 pb-0`}
  }
`;

const NavLink = tw(NavLinkBase)`
  sm:text-sm sm:mx-6
`;

export default function NavLinksCustom() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();

  const handleLogin = () => {
    dispatch(login());
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <NavLinks key={1}>
      <NavLink href="/listings">Listings</NavLink>
      {isLoggedIn ? (
        <NavLink href="/profile">Profile</NavLink>
      ) : (
        // <NavLink href="/login onClick={handleLogin}>Login</NavLink> # TODO: incorporate auth
        <button href="#" onClick={handleLogin}>Login</button>
      )}
    </NavLinks>
  );
}
