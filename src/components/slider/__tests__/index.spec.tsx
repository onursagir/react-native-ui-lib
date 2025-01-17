import React from 'react';
import Slider, {SliderProps} from '../index';
// import View from '../../view';
import {SliderDriver} from '../Slider.driver';

describe('Slider', () => {
  afterEach(() => {
    SliderDriver.clear();
  });

  const sliderDriver = (testID: string, props: Partial<SliderProps>) => {
    const defaultProps: Partial<SliderProps> = {
      testID,
      onValueChange: jest.fn(),
      disabled: false
    };
    const component = (<Slider {...defaultProps} {...props}/>);
    return new SliderDriver({
      component,
      testID
    });
  };

  it('Should be disabled', async () => {
    const testId = 'slider-comp';
    const driver = await sliderDriver(testId, {disabled: true});
  
    expect(await driver.isDisabled()).toBe(true);
  });
  
  it('Should be disabled', async () => {
    const testId = 'slider-comp';
    const driver = await sliderDriver(testId, {disabled: false});
    console.log('TEST: ', await driver.getPropsByTestId(testId));

    expect(await driver.isDisabled()).toBe(false);
  });
});
