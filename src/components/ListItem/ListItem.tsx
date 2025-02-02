import React from 'react';

import './ListItem.css';

export interface ListItemProps {
  name: string;
  description: string;
}

class ListItem extends React.Component<ListItemProps> {
  render() {
    const { name, description } = this.props;

    return (
      <div className="list-item">
        <span>{name}</span>
        <span>{description}</span>
      </div>
    );
  }
}

export default ListItem;
