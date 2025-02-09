import React from 'react';

import './List.css';
import { Hero } from '../Main/Main.tsx';
import ListItem from '../ListItem';

interface ListProps {
  items: Hero[];
  loading: boolean;
}

const List: React.FC<ListProps> = ({ items, loading }) => {
  if (items.length && !loading) {
    return (
      <div className="list">
        <div className="list__row">
          <ListItem name="Name" description="Description" />
        </div>

        {items.map((item, index) => (
          <div key={index} className="list__row">
            <ListItem
              name={item.name}
              description={`Gender is ${item.gender}, height is ${item.height}, hair color is ${item.hair_color}, skin color is ${item.skin_color}`}
            />
          </div>
        ))}
      </div>
    );
  }

  if (!items.length && !loading) {
    return <div className="empty">Sorry, we can not find your hero</div>;
  }

  return null;
};

export default List;
