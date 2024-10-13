import React, { useState } from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { ContentWithPaddingXl } from "components/misc/Layouts";
import { ReactComponent as StarIcon } from "images/star-icon.svg";
import ListingsFilter from "components/forms/ListingsFilter";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons";
import { ReactComponent as PriceIcon } from "feather-icons/dist/icons/dollar-sign.svg";
import { ReactComponent as LocationIcon } from "feather-icons/dist/icons/map-pin.svg";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import Header, { LogoLink } from "components/headers/light.js";
import NavLinksCustom from 'components/headers/NavLinksCustom.js';
import { useNavigate } from "react-router-dom";


const StyledHeader = styled(Header)`
  ${tw`justify-between`}
  ${LogoLink} {
    ${tw`mr-8 pb-0`}
  }
`;
const CardContainer = tw.div`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8`;
const Container = tw.div`relative`;

const ControlButton = styled(PrimaryButtonBase)`
  ${tw`mt-4 sm:mt-0 first:ml-0 ml-6 rounded-full p-2`}
  svg {
    ${tw`w-6 h-6`}
  }
`;

const Card = tw.div`h-full flex! flex-col sm:border max-w-sm sm:rounded-tl-4xl sm:rounded-br-5xl relative focus:outline-none`;
const CardImage = styled.div((props) => [
  `background-image: url("${props.imageSrc}");`,
  tw`w-full h-56 sm:h-64 bg-cover bg-center rounded sm:rounded-none sm:rounded-tl-4xl`,
]);

const TextInfo = tw.div`py-6 sm:px-10 sm:py-6`;
const TitleReviewContainer = tw.div`flex flex-col sm:flex-row sm:justify-between sm:items-center`;
const Title = tw.h5`text-2xl font-bold`;

const RatingsInfo = styled.div`
  ${tw`flex items-center sm:ml-4 mt-2 sm:mt-0`}
  svg {
    ${tw`w-6 h-6 text-yellow-500 fill-current`}
  }
`;
const Rating = tw.span`ml-2 font-bold`;

const Description = tw.p`text-sm leading-loose mt-2 sm:mt-4`;

const SecondaryInfoContainer = tw.div`flex flex-col sm:flex-row mt-2 sm:mt-4`;
const IconWithText = tw.div`flex items-center mr-6 my-2 sm:my-0`;
const IconContainer = styled.div`
  ${tw`inline-block rounded-full p-2 bg-gray-700 text-gray-100`}
  svg {
    ${tw`w-3 h-3`}
  }
`;
const Text = tw.div`ml-2 text-sm font-semibold text-gray-800`;
const PrimaryButton = tw(PrimaryButtonBase)`mt-auto sm:text-lg rounded-none w-full rounded sm:rounded-none sm:rounded-br-4xl py-3 sm:py-6`;

const ListingsPage = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([
    {
      id: 1,
      title: "Hotel A",
      price: "$120",
      rating: 4.8,
      imageSrc: "https://example.com/hotel-a.jpg",
    },
    {
      id: 2,
      title: "Hotel B",
      price: "$90",
      rating: 4.5,
      imageSrc: "https://example.com/hotel-b.jpg",
    },
    {
      id: 3,
      title: "Hotel C",
      price: "$150",
      rating: 4.9,
      imageSrc: "https://example.com/hotel-c.jpg",
    },
    {
      id: 4,
      title: "Hotel D",
      price: "$110",
      rating: 4.7,
      imageSrc: "https://example.com/hotel-d.jpg",
    },
    {
      id: 5,
      title: "Hotel D",
      price: "$110",
      rating: 4.7,
      imageSrc: "https://example.com/hotel-d.jpg",
    },
    {
      id: 6,
      title: "Hotel D",
      price: "$110",
      rating: 4.7,
      imageSrc: "https://example.com/hotel-d.jpg",
    },
    {
      id: 7,
      title: "Hotel D",
      price: "$110",
      rating: 4.7,
      imageSrc: "https://example.com/hotel-d.jpg",
    },
  ]);

  const handleBookNow = (id) => {
    navigate(`/listing/${id}`);
  };
  

  const handleSortChange = (e) => {
    const sortedListings = [...listings].sort((a, b) => {
      if (e.target.value === "price")
        return (
          parseFloat(a.price.replace("$", "")) -
          parseFloat(b.price.replace("$", ""))
        );
      if (e.target.value === "rating") return b.rating - a.rating;
      return 0;
    });
    setListings(sortedListings);
  };

  const handleFilterChange = (e) => {
  };

  return (
    <AnimationRevealPage disabled>
      <StyledHeader links={<NavLinksCustom/>} collapseBreakpointClass="sm" />
      <Container>
        <ContentWithPaddingXl>
          <ListingsFilter
            onSortChange={handleSortChange}
            onFilterChange={handleFilterChange}
          />
          <CardContainer>
            {listings.map((card, index) => (
              <Card key={index}>
                <CardImage imageSrc={card.imageSrc} />
                <TextInfo>
                  <TitleReviewContainer>
                    <Title>{card.title}</Title>
                    <RatingsInfo>
                      <StarIcon />
                      <Rating>{card.rating}</Rating>
                    </RatingsInfo>
                  </TitleReviewContainer>
                  <SecondaryInfoContainer>
                    <IconWithText>
                      <IconContainer>
                        <LocationIcon />
                      </IconContainer>
                      <Text>{card.locationText}</Text>
                    </IconWithText>
                    <IconWithText>
                      <IconContainer>
                        <PriceIcon />
                      </IconContainer>
                      <Text>{card.pricingText}</Text>
                    </IconWithText>
                  </SecondaryInfoContainer>
                  <Description>{card.description}</Description>
                </TextInfo>
                <PrimaryButton onClick={() => handleBookNow(card.id)}>Book Now</PrimaryButton>
              </Card>
            ))}
          </CardContainer>
        </ContentWithPaddingXl>
      </Container>
    </AnimationRevealPage>
  );
};

export default ListingsPage;
