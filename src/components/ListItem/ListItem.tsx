import React from 'react';

import './ListItem.css';

export interface ListItemProps {
  name: string;
  description: string;
}

const ListItem: React.FC<ListItemProps> = ({ name, description }) => {
  return (
    <div className="list-item">
      <span>{name}</span>
      <span>{description}</span>
    </div>
  );
};

export default ListItem;
