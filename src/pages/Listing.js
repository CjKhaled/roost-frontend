import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { PrimaryButton } from "components/misc/Buttons";
import { ReactComponent as StarIcon } from "feather-icons/dist/icons/star.svg";
import { ReactComponent as LocationIcon } from "feather-icons/dist/icons/map-pin.svg";
import { ReactComponent as PriceIcon } from "feather-icons/dist/icons/dollar-sign.svg";
import Header, { LogoLink } from "components/headers/light.js";
import NavLinksCustom from 'components/headers/NavLinksCustom.js';
import AnimationRevealPage from "helpers/AnimationRevealPage";

const Container = tw.div`relative`;
const Content = tw.div`max-w-screen-xl mx-auto py-16 lg:py-20`;
const TwoColumn = tw.div`flex flex-col md:flex-row`;
const Column = tw.div`md:w-1/2`;
const ImageGallery = styled.div`
  ${props => `background-image: url("${props.imageSrc}");`}
  ${tw`h-64 sm:h-96 bg-cover bg-center rounded-lg`}
`;
const InfoSection = tw(Column)`p-8`;
const Title = tw.h2`text-3xl font-bold`;
const Description = tw.p`text-lg mt-4`;
const SecondaryInfoContainer = tw.div`flex items-center mt-4`;
const IconWithText = tw.div`flex items-center mr-6 my-2 sm:my-0`;
const IconContainer = tw.div`inline-block rounded-full p-2 bg-gray-700 text-gray-100`;
const Rating = tw.div`flex items-center mt-4`;
const Location = tw(IconWithText)``;
const Price = tw(IconWithText)``;

const BookNowButton = tw(PrimaryButton)`mt-8 w-full sm:w-auto`;

const ListingPage = () => {
  const { id } = useParams();
  
  const listings = [
    {
      id: "1",
      title: "Hotel A",
      description: "A luxurious hotel with beautiful views.",
      rating: 4.8,
      price: "$120/night",
      location: "New York, USA",
      imageSrc: "https://example.com/hotel-a.jpg",
    },
    {
      id: "2",
      title: "Hotel B",
      description: "A budget-friendly hotel in the heart of the city.",
      rating: 4.5,
      price: "$90/night",
      location: "Los Angeles, USA",
      imageSrc: "https://example.com/hotel-b.jpg",
    },
  ];

  const listing = listings.find((listing) => listing.id === id);

  if (!listing) {
    return <div>Listing not found</div>;
  }

  return (
    <AnimationRevealPage disabled>
      <Header links={<NavLinksCustom />} />
      <Container>
        <Content>
          <TwoColumn>
            <ImageGallery imageSrc={listing.imageSrc} />
            <InfoSection>
              <Title>{listing.title}</Title>
              <Rating>
                <StarIcon tw="w-6 h-6 text-yellow-500" />
                <span tw="ml-2 font-bold">{listing.rating}</span>
              </Rating>
              <SecondaryInfoContainer>
                <Location>
                  <IconContainer>
                    <LocationIcon />
                  </IconContainer>
                  <span>{listing.location}</span>
                </Location>
                <Price>
                  <IconContainer>
                    <PriceIcon />
                  </IconContainer>
                  <span>{listing.price}</span>
                </Price>
              </SecondaryInfoContainer>
              <Description>{listing.description}</Description>
              <BookNowButton>Book Now</BookNowButton>
            </InfoSection>
          </TwoColumn>
        </Content>
      </Container>
    </AnimationRevealPage>
  );
};

export default ListingPage;
