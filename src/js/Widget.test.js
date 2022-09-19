/**
 * @jest-environment jsdom
 */

import Widget from './Widget';

test('whether class can actually create widget', () => {
  new Widget();
  const widgetWindow = document.querySelector('.widget-window');
  expect(widgetWindow).toBeTruthy();
});
