import 'normalize.css';

import sizeHelper   from '../../../../Common/Misc/SizeHelper';

import CompositeClosureHelper from '../../../../../src/Common/Core/CompositeClosureHelper';
import FieldProvider from '../../../../../src/InfoViz/Core/FieldProvider';
import LegendProvider from '../../../../../src/InfoViz/Core/LegendProvider';
import Histogram1DProvider from '../../../../../src/InfoViz/Core/Histogram1DProvider';
import HistogramBinHoverProvider from '../../../../../src/InfoViz/Core/HistogramBinHoverProvider';
import PartitionProvider from '../../../../../src/InfoViz/Core/PartitionProvider';
import ScoresProvider from '../../../../../src/InfoViz/Core/ScoresProvider';
import SelectionProvider from '../../../../../src/InfoViz/Core/SelectionProvider';

import HistogramSelector from '../../../Native/HistogramSelector';
import FieldSelector from '../../../Native/FieldSelector';

import dataModel from './state.json';

const bodyElt = document.querySelector('body');
// '100vh' is 100% of the current screen height
const defaultHeight = '100vh';

const histogramSelectorContainer = document.createElement('div');
histogramSelectorContainer.style.position = 'relative';
histogramSelectorContainer.style.width = '58%';
histogramSelectorContainer.style.height = defaultHeight;
histogramSelectorContainer.style.float = 'left';
bodyElt.appendChild(histogramSelectorContainer);

const fieldSelectorContainer = document.createElement('div');
fieldSelectorContainer.style.position = 'relative';
fieldSelectorContainer.style.width = '42%';
fieldSelectorContainer.style.height = defaultHeight;
fieldSelectorContainer.style.float = 'left';
fieldSelectorContainer.style['font-size'] = '10pt';
bodyElt.appendChild(fieldSelectorContainer);

const provider = CompositeClosureHelper.newInstance((publicAPI, model, initialValues = {}) => {
  Object.assign(model, initialValues);
  FieldProvider.extend(publicAPI, model, initialValues);
  Histogram1DProvider.extend(publicAPI, model, initialValues);
  HistogramBinHoverProvider.extend(publicAPI, model);
  LegendProvider.extend(publicAPI, model, initialValues);
  PartitionProvider.extend(publicAPI, model, initialValues);
  ScoresProvider.extend(publicAPI, model, initialValues);
  SelectionProvider.extend(publicAPI, model, initialValues);
})(dataModel);

// set provider behaviors
provider.setFieldsSorted(true);
provider.getFieldNames().forEach(name => {
  provider.addLegendEntry(name);
});
provider.assignLegend(['colors', 'shapes']);

// activate scoring gui
const scores = [
  { name: 'Yes', color: '#00C900', value: 1 },
  { name: 'Maybe', color: '#FFFF00', value: 0 },
  { name: 'No', color: '#C90000', value: -1 },
];
provider.setScores(scores);
provider.setDefaultScore(1);

// Create histogram selector
const histogramSelector = HistogramSelector.newInstance({
  provider,
  container: histogramSelectorContainer,
  // defaultScore: 1,
});

// Create field selector
const fieldSelector = FieldSelector.newInstance({ provider, container: fieldSelectorContainer });

// Listen to window resize
sizeHelper.onSizeChange(() => {
  histogramSelector.resize();
  fieldSelector.resize();
});
sizeHelper.startListening();

sizeHelper.triggerChange();