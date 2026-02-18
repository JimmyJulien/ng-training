import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

type StringOrRegexp = string | RegExp;

export const typeInInput = async ({
  label,
  value,
}: {
  label: StringOrRegexp;
  value: string;
}) => {
  const inputLogin = await screen.findByLabelText(label);
  return userEvent.type(inputLogin, value, { delay: 50 });
};

export const clickButton = async ({ label }: { label: StringOrRegexp }) => {
  const submitButton = await screen.findByRole('button', {
    name: label,
  });
  return userEvent.click(submitButton);
};

export const mainTitle = async ({ label }: { label: StringOrRegexp }) => {
  return screen.findByRole('heading', {
    level: 1,
    name: label,
  });
};
