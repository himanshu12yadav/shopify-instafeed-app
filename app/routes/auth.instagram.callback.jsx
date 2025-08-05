import { redirect, json } from '@remix-run/node';
import axios from 'axios';
import qs from 'qs';
import { createOrUpdate } from '../db.server.js';

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  const { shop } = JSON.parse(atob(state));

  if (!code) {
    return redirect('/app'); // Redirect if no code is present in the callback URL
  }

  try {
    // Exchange the authorization code for a short-lived access token
    const requestData = qs.stringify({
      client_id: '624455150004028',
      client_secret: '33f126ed6da9cf78907abb35ca28c22e',
      grant_type: 'authorization_code',
      redirect_uri:
        'https://instagramfeed-app.sprinix.com/auth/instagram/callback',
      code,
    });

    const response = await axios.post(
      'https://api.instagram.com/oauth/access_token',
      requestData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token: shortLivedToken, user_id } = response.data;

    // Exchange the short-lived token for a long-lived token
    const longLivedResponse = await axios.get(
      'https://graph.instagram.com/access_token',
      {
        params: {
          grant_type: 'ig_exchange_token',
          client_secret: '33f126ed6da9cf78907abb35ca28c22e',
          access_token: shortLivedToken, // Use the short-lived token here
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token: longLivedToken } = longLivedResponse.data;

    // getting user data

    const userProfile = await axios.get(
      `https://graph.instagram.com/me?fields=id,username,account_type&access_token=${longLivedToken}`
    );

    // collecting all information required for the database operation

    const { id: instagramId, username, account_type } = userProfile.data;
    const data = {
      instagramId: instagramId,
      instagramUsername: username,
      instagramToken: longLivedToken,
      instagramTokenExpires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now,
      accountType: account_type,
    };

    // Stored the long-lived token and user ID in the database

    const result = await createOrUpdate(data);

    // Redirect to the app or any other page after successful authentication

    if (Object.keys(result).length > 0) {
      console.log('result', result);
      return redirect(
        `https://admin.shopify.com/store/${shop}/apps/${process.env.SHOPIFY_APP_HANDLE}/app`,
        {
          status: 302,
        }
      );
    } else {
      return json(
        { error: 'Failed to authenticate with Instagram' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error during Instagram OAuth process:', error.message);

    return new Response('Failed to authenticate with Instagram', {
      status: 500,
    });
  }

  return null;
};
