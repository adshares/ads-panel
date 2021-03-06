import React from 'react';
import { shallow } from 'enzyme';
import TypeTableCell from '../TypeTableCell';
const TYPE_DEFAULT = 'send_one';

describe('<TypeTableCell />', () => {
  it('should render <TypeTableCell />', () => {
    const renderedComponent = shallow(<TypeTableCell value={TYPE_DEFAULT} />);
    expect(renderedComponent.find('IconTableCell').length).toEqual(1);
    expect(renderedComponent.find('FaLongArrowAltRight').length).toEqual(1);
    expect(renderedComponent.find('FaLongArrowAltLeft').length).toEqual(0);
    expect(renderedComponent.find('IconCellDescription').length).toEqual(0);
  });

  it('should render icon with text when gets showDesc props', () => {
    const renderedComponent = shallow(
      <TypeTableCell value={TYPE_DEFAULT} showDesc />,
    );
    expect(renderedComponent.find('IconCellDescription').length).toEqual(1);
  });
});
