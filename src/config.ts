const config = {
  auth: {
    username: process.env.ig_username || '',
    password: process.env.ig_password || '',
  },
  followInfo: {
    followIfUserFollows: true,
  },
  postInfo: {
    hashtags: ['like4like', 'follow4follow', 'followforfollow', 'likeforlike'],
    numberOfPosts: Number(process.env.ig_no_of_posts) || 20,
    unfollow: Number(process.env.ig_no_of_follow) || 20,
    commentProbability: 65,
    comments: [
      'Great',
      'Wow',
      'Damn',
      'Nice',
      'Cool!',
      'Awesome',
      'Beautiful',
      'Amazing',
      'Perfect',
      'Wonderful',
    ],
  },
};

export = config;
