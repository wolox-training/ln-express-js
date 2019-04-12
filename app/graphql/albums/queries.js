const { GraphQLList, GraphQLString, GraphQLNonNull } = require('graphql'),
  { albumType } = require('./types'),
  { album: albumModel } = require('../../models');

exports.album = {
  description: 'it returns all albums',
  type: GraphQLList(albumType),
  resolve: async (obj, root, context, info) => {
    return albumModel.getAllAlbums();
  }
};
