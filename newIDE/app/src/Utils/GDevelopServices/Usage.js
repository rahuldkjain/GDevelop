// @flow
import axios from 'axios';
import { GDevelopUsageApi } from './ApiConfigs';

export type Usage = {
  id: string,
  userId: string,
  type: string,
  createdAt: number,
};
export type Usages = Array<Usage>;

export type Subscription = {|
  userId: string,
  planId: string | null,
  createdAt: number,
  updatedAt: number,
  stripeSubscriptionId?: string,
  stripeCustomerId?: string,
|};

export type Limit = {|
  limitReached: boolean,
  current: number,
  max: number,
|};

export type Limits = {
  [string]: Limit,
};

export type PlanDetails = {
  planId: string | null,
  name: string,
  monthlyPriceInEuros: number,
  smallDescription: string,
  descriptionBullets: Array<string>,
  extraDescription?: string,
};

export const getSubscriptionPlans = (): Array<PlanDetails> => [
  {
    planId: 'gdevelop_pro',
    name: 'GDevelop Pro',
    monthlyPriceInEuros: 7,
    smallDescription: 'Ideal for advanced game makers',
    descriptionBullets: [
      'Package your game for Android up to 70 times a day.',
      'One-click packaging for Windows, macOS and Linux up to 70 times a day.',
      'Use Live Preview over Wifi to quickly test your game on mobiles and tablets.',
      'Use the Debugger to find and solve issues in your games.',
      'Immerse your players by removing GDevelop logo when the game loads.',
    ],
    extraDescription:
      "You'll also have access to online packaging for iOS or other services when they are released.",
  },
  {
    planId: 'gdevelop_indie',
    name: 'GDevelop Indie',
    monthlyPriceInEuros: 2,
    smallDescription: 'Ideal for beginners',
    descriptionBullets: [
      'Package your game for Android up to 10 times a day.',
      'One-click packaging for Windows, macOS and Linux up to 10 times a day.',
      'Use Live Preview over Wifi to quickly test your game on mobiles and tablets',
      'Use the Debugger to find and solve issues in your games.',
      'Immerse your players by removing GDevelop logo when the game loads',
    ],
    extraDescription:
      "You'll also have access to online packaging for iOS or other services when they are released.",
  },
  {
    planId: null,
    name: 'No subscription',
    monthlyPriceInEuros: 0,
    smallDescription: '',
    descriptionBullets: [
      'You can use GDevelop for free! Online packaging for Android, Windows, macOS and Linux is limited to twice a day to avoid overloading the services.',
    ],
  },
];

export const getUserUsages = (
  getAuthorizationHeader: () => Promise<string>,
  userId: string
): Promise<Usages> => {
  return getAuthorizationHeader()
    .then(authorizationHeader =>
      axios.get(`${GDevelopUsageApi.baseUrl}/usage`, {
        params: {
          userId,
        },
        headers: {
          Authorization: authorizationHeader,
        },
      })
    )
    .then(response => response.data);
};

export const getUserLimits = (
  getAuthorizationHeader: () => Promise<string>,
  userId: string
): Promise<Limits> => {
  return getAuthorizationHeader()
    .then(authorizationHeader =>
      axios.get(`${GDevelopUsageApi.baseUrl}/limits`, {
        params: {
          userId,
        },
        headers: {
          Authorization: authorizationHeader,
        },
      })
    )
    .then(response => response.data.limits);
};

export const getUserSubscription = (
  getAuthorizationHeader: () => Promise<string>,
  userId: string
): Promise<Subscription> => {
  return getAuthorizationHeader()
    .then(authorizationHeader =>
      axios.get(`${GDevelopUsageApi.baseUrl}/subscription`, {
        params: {
          userId,
        },
        headers: {
          Authorization: authorizationHeader,
        },
      })
    )
    .then(response => response.data);
};

export const changeUserSubscription = (
  getAuthorizationHeader: () => Promise<string>,
  userId: string,
  newSubscriptionDetails: { planId: string | null, stripeToken?: any }
): Promise<Subscription> => {
  return getAuthorizationHeader()
    .then(authorizationHeader =>
      axios.post(
        `${GDevelopUsageApi.baseUrl}/subscription`,
        newSubscriptionDetails,
        {
          params: {
            userId,
          },
          headers: {
            Authorization: authorizationHeader,
          },
        }
      )
    )
    .then(response => response.data);
};
