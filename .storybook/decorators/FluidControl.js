import React from 'react';

const GLOBAL_NAME = 'grid';

const global = {
  [GLOBAL_NAME]: {
    name: 'Grid',
    description: 'Grid system to control fluidity of components',
    defaultValue: 'none',
    toolbar: {
      icon: 'component',
      items: ['none', 'borders', 'grid'],
    },
  },
};

const style = '1px dashed royalblue'

const Cell = ({ top, right, bottom , left, ...props }) => (<div style={{
  borderTop: top ? style : '',
  borderRight: right ? style : '',
  borderBottom: bottom ? style : '',
  borderLeft: left ? style : '',
}} {...props} />)

const Grid = (props) => {
  return (<div style={{
    position: 'absolute',
    display: 'grid',
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
    gridTemplateColumns: '1em min-content 1em auto 1em',
    gridTemplateRows: '1em min-content 1em auto 1em',
  }}>
    <Cell right bottom />
    <Cell bottom />
    <Cell right bottom left />
    <Cell bottom />
    <Cell bottom left />

    <Cell right />
    <div {...props} />
    <Cell right left />
    <div {...props} />
    <Cell left />
    
    <Cell top right bottom />
    <Cell top bottom />
    <Cell top right bottom left />
    <Cell top bottom />
    <Cell top bottom left />

    <Cell right />
    <div {...props} />
    <Cell right left />
    <div {...props} />
    <Cell left />

    <Cell top right />
    <Cell top />
    <Cell top right left />
    <Cell top />
    <Cell top left />
  </div>)
}

const decorator = (Story, { globals: { [GLOBAL_NAME]: val } }) => {
  if (val === 'borders') return <Cell top right bottom left><Story /></Cell>
  else if (val === 'grid') return <Grid><Story /></Grid>

  return <Story />
}

export default {
  global, decorator
}
