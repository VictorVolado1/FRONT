import React from 'react';
import { Toolbar } from 'primereact/toolbar';
import { Avatar } from 'primereact/avatar';

const TopBar = () => {

    const endContent = (
        <React.Fragment>
            <Avatar icon="pi pi-user" size="large" shape="circle" />
        </React.Fragment>
    );

    return (
        <div className="card">
            <Toolbar  end={endContent} />
        </div>
    );
  
};

export default TopBar;