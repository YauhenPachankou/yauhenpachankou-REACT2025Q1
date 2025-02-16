import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import './Details.css';
import { useSearchParams } from 'react-router';

interface HeroDetails {
  name: string;
  gender: string;
  hair_color: string;
  skin_color: string;
  height: string;
  birth_year: string;
}

const Details: React.FC = () => {
  const [heroDetails, setHeroDetails] = useState<HeroDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const detailsId = searchParams.get('detailsId') || '';

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(
          `https://swapi.dev/api/people/${detailsId}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch details');
        }
        const data = await response.json();
        setHeroDetails(data);
      } catch (error) {
        console.log((error as Error).message);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [detailsId]);

  const handleClose = () => {
    navigate(-1);
  };

  if (loading) {
    return <div className="details__loading">Loading...</div>;
  }

  if (!heroDetails) {
    return <div>No details found.</div>;
  }

  return (
    <div className="details">
      <div className="details__wrapper">
        <h2 className="details__title">{heroDetails.name}</h2>
        <button className="details__close" onClick={handleClose}>
          &times;
        </button>
      </div>
      <p>Gender: {heroDetails.gender}</p>
      <p>Birth Year: {heroDetails.birth_year}</p>
      <p>Height: {heroDetails.height}</p>
      <p>Hair Color: {heroDetails.hair_color}</p>
      <p>Skin Color: {heroDetails.skin_color}</p>
    </div>
  );
};

export default Details;
