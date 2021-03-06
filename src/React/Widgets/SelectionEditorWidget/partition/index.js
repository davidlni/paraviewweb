import React from 'react';

import FieldRender      from './FieldRender';
import DividerRender    from './DividerRender';
import SelectionBuilder from '../../../../Common/Misc/SelectionBuilder';

export default function partitionSelection(props) {
  const dividers = props.selection.partition.dividers;
  const fieldName = props.selection.partition.variable;

  const onChange = (changedPath, editing = false) => {
    // clone, so we don't step on whatever is current.
    const selection = JSON.parse(JSON.stringify(props.selection));
    if (changedPath[0] === 'dividers') {
      const divider = selection.partition.dividers[changedPath[1]];
      const changeItemKey = changedPath[2];
      const newValue = changedPath[3];

      // console.log('change', divider, changeItemKey, newValue);
      divider[changeItemKey] = newValue;
    }

    // Notify happens in parent
    props.onChange(editing ? selection : SelectionBuilder.markModified(selection), !editing);
  };

  const onDelete = pathToDelete => {
    // clone, so we don't step on whatever is current.
    const selection = JSON.parse(JSON.stringify(props.selection));
    if (pathToDelete[0] === 'dividers') {
      const deleteIndex = pathToDelete[1];
      // remove one.
      selection.partition.dividers.splice(deleteIndex, 1);
    }

    props.onChange(SelectionBuilder.markModified(selection), true);
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 0 }}>
        { props.children }
      </div>
      <FieldRender className={props.className} fieldName={fieldName} getLegend={props.getLegend} depth={0} >
        {dividers.map((divider, idx) =>
          <DividerRender
            onChange={onChange}
            onDelete={onDelete}
            divider={divider}
            path={['dividers', idx]}
            key={idx}
            getLegend={props.getLegend}
          />
        )}
      </FieldRender>
    </div>);
}

partitionSelection.propTypes = {
  selection: React.PropTypes.object,
  ranges: React.PropTypes.object,
  onChange: React.PropTypes.func,
  getLegend: React.PropTypes.func,
  className: React.PropTypes.string,
};

