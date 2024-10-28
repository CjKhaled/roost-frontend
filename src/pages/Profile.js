// \src\pages\Profile.js

import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "store/userSlice";
import tw from "twin.macro";
import styled from "styled-components";
import ProfileThreeColGrid from "components/cards/ProfileThreeColGrid";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";

import { ReactComponent as TwitterIcon} from "images/twitter-icon.svg";
import { ReactComponent as LinkedinIcon} from "images/linkedin-icon.svg";
import { ReactComponent as GithubIcon } from "images/github-icon.svg";
import { useNavigate } from "react-router-dom";

import Header, { LogoLink } from "components/headers/light.js";
import NavLinksCustom from 'components/headers/NavLinksCustom.js';

const StyledHeader = styled(Header)`
  ${tw`justify-between`}
  ${LogoLink} {
    ${tw`mr-8 pb-0`}
  }
`;

const LogoutButton = styled.button`
  ${tw`mt-6 p-3 w-56 text-sm font-bold uppercase tracking-wider bg-red-500 text-white rounded-full transition duration-300 hocus:bg-red-700 hocus:text-white`}
`;

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <AnimationRevealPage disabled>
      <StyledHeader links={<NavLinksCustom/>} collapseBreakpointClass="sm" />
      <ProfileThreeColGrid
        heading="Your Profile"
        subheading="Profile Info"
        description="Manage your account details and listings."
        cards={[
          {
            imageSrc: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&fit=facearea&facepad=2.95&w=512&h=512&q=80",
            position: "Hotel Owner",
            name: "John Doe",
            links: [
              {
                url: "https://twitter.com",
                icon: TwitterIcon,
              },
              {
                url: "https://linkedin.com",
                icon: LinkedinIcon,
              },
              {
                url: "https://github.com",
                icon: GithubIcon,
              },
            ],
          },
        ]}
      />
      <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
    </AnimationRevealPage>
  );
}
