"use strict";

var _error = require("./lib/helpers/error");

var express = require('express');

var path = require('path');

var logger = require('morgan'); // eslint-disable-next-line no-unused-vars


var compression = require('compression'); // eslint-disable-next-line no-unused-vars


var helmet = require('helmet');

var mongoose = require('mongoose');

var fs = require('fs');

var jwt = require('jsonwebtoken');

var cors = require('cors');

require('dotenv-defaults').config();

var indexRouter = require('./routes/index.route');

var usersRouter = require('./routes/user.route');

var docRouter = require('./routes/document.route');

var messageRouter = require('./routes/message.route');

var app = express();

try {
  mongoose.connect(process.env.NODE_ENV == 'test' ? process.env.DB_PATH_TEST : process.env.DB_PATH, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
  });
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

mongoose.set('useCreateIndex', true);
process.env.NODE_ENV === 'production' ? app.use(compression()).use(helmet()) : null; // logging setup (check if using test env)

if (process.env.NODE_ENV !== 'test') {
  app.use(logger('[ :date[web] ] :method :url - :status in :response-time[3] ms', {
    skip: function skip(req, res) {
      return res.statusCode < 400;
    }
  }));
  app.use(logger('[ :date[web] ] :method :url - :remote-addr', {
    stream: fs.createWriteStream(path.join(__dirname, 'access.log'), {
      flags: 'a'
    })
  }));
}

app.use(cors({
  origin: '*'
})); // app.options('*', (req: Request, res: Response) => {
// 	res.header('Access-Control-Allow-Origin', '*')
// 	res.header('Access-Control-Allow-Methods', '*')
// 	res.header('Access-Control-Allow-Headers', '*')
// 	//res.header('Access-Control-Allow-Credentials', '*')
// 	console.log('PREFLIGHT')
// 	res.end()
// })

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use('/user', usersRouter);
app.use('/document', docRouter);
app.use('/message', messageRouter);
app.use('/', indexRouter); // error handler
// eslint-disable-next-line no-unused-vars

app.use(function (err, req, res, next) {
  console.error(err);
  (0, _error.handleError)(err, res);
});
app.use(function (req, res) {
  res.status(404).json({
    error: 'Route not found'
  });
});
module.exports = app;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHAudHMiXSwibmFtZXMiOlsiZXhwcmVzcyIsInJlcXVpcmUiLCJwYXRoIiwibG9nZ2VyIiwiY29tcHJlc3Npb24iLCJoZWxtZXQiLCJtb25nb29zZSIsImZzIiwiand0IiwiY29ycyIsImNvbmZpZyIsImluZGV4Um91dGVyIiwidXNlcnNSb3V0ZXIiLCJkb2NSb3V0ZXIiLCJtZXNzYWdlUm91dGVyIiwiYXBwIiwiY29ubmVjdCIsInByb2Nlc3MiLCJlbnYiLCJOT0RFX0VOViIsIkRCX1BBVEhfVEVTVCIsIkRCX1BBVEgiLCJ1c2VOZXdVcmxQYXJzZXIiLCJ1c2VVbmlmaWVkVG9wb2xvZ3kiLCJ1c2VGaW5kQW5kTW9kaWZ5IiwiZXJyb3IiLCJjb25zb2xlIiwibWVzc2FnZSIsImV4aXQiLCJzZXQiLCJ1c2UiLCJza2lwIiwicmVxIiwicmVzIiwic3RhdHVzQ29kZSIsInN0cmVhbSIsImNyZWF0ZVdyaXRlU3RyZWFtIiwiam9pbiIsIl9fZGlybmFtZSIsImZsYWdzIiwib3JpZ2luIiwianNvbiIsInVybGVuY29kZWQiLCJleHRlbmRlZCIsImVyciIsIm5leHQiLCJzdGF0dXMiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOztBQUNBOztBQUVBLElBQUlBLE9BQU8sR0FBR0MsT0FBTyxDQUFDLFNBQUQsQ0FBckI7O0FBQ0EsSUFBSUMsSUFBSSxHQUFHRCxPQUFPLENBQUMsTUFBRCxDQUFsQjs7QUFDQSxJQUFJRSxNQUFNLEdBQUdGLE9BQU8sQ0FBQyxRQUFELENBQXBCLEMsQ0FFQTs7O0FBQ0EsSUFBSUcsV0FBVyxHQUFHSCxPQUFPLENBQUMsYUFBRCxDQUF6QixDLENBQ0E7OztBQUNBLElBQUlJLE1BQU0sR0FBR0osT0FBTyxDQUFDLFFBQUQsQ0FBcEI7O0FBQ0EsSUFBSUssUUFBUSxHQUFHTCxPQUFPLENBQUMsVUFBRCxDQUF0Qjs7QUFDQSxJQUFJTSxFQUFFLEdBQUdOLE9BQU8sQ0FBQyxJQUFELENBQWhCOztBQUNBLElBQUlP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QTs7QUFDQUksR0FBRyxDQUFDZSxHQUFKLENBQVEsVUFBVWMsR0FBVixFQUE2QlosR0FBN0IsRUFBMkNDLEdBQTNDLEVBQTBEWSxJQUExRCxFQUE4RTtBQUNyRm5CLEVBQUFBLE9BQU8sQ0FBQ0QsS0FBUixDQUFjbUIsR0FBZDtBQUNBLDBCQUFZQSxHQUFaLEVBQWlCWCxHQUFqQjtBQUNBLENBSEQ7QUFLQWxCLEdBQUcsQ0FBQ2UsR0FBSixDQUFRLFVBQUNFLEdBQUQsRUFBTUMsR0FBTixFQUFjO0FBQ3JCQSxFQUFBQSxHQUFHLENBQUNhLE1BQUosQ0FBVyxHQUFYLEVBQWdCTCxJQUFoQixDQUFxQjtBQUFFaEIsSUFBQUEsS0FBSyxFQUFFO0FBQVQsR0FBckI7QUFDQSxDQUZEO0FBSUFzQixNQUFNLENBQUNDLE9BQVAsR0FBaUJqQyxHQUFqQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlcXVlc3QsIFJlc3BvbnNlLCBOZXh0RnVuY3Rpb24gfSBmcm9tICdleHByZXNzJ1xyXG5pbXBvcnQgeyBoYW5kbGVFcnJvciwgRXJyb3JIYW5kbGVyIH0gZnJvbSAnLi9saWIvaGVscGVycy9lcnJvcic7XHJcblxyXG52YXIgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MnKVxyXG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxyXG52YXIgbG9nZ2VyID0gcmVxdWlyZSgnbW9yZ2FuJylcclxuXHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xyXG52YXIgY29tcHJlc3Npb24gPSByZXF1aXJlKCdjb21wcmVzc2lvbicpXHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xyXG52YXIgaGVsbWV0ID0gcmVxdWlyZSgnaGVsbWV0JylcclxudmFyIG1vbmdvb3NlID0gcmVxdWlyZSgnbW9uZ29vc2UnKVxyXG52YXIgZnMgPSByZXF1aXJlKCdmcycpXHJcbnZhciBqd3QgPSByZXF1aXJlKCdqc29ud2VidG9rZW4nKVxyXG52YXIgY29ycyA9IHJlcXVpcmUoJ2NvcnMnKVxyXG5cclxucmVxdWlyZSgnZG90ZW52LWRlZmF1bHRzJykuY29uZmlnKClcclxuXHJcbnZhciBpbmRleFJvdXRlciA9IHJlcXVpcmUoJy4vcm91dGVzL2luZGV4LnJvdXRlJylcclxudmFyIHVzZXJzUm91dGVyID0gcmVxdWlyZSgnLi9yb3V0ZXMvdXNlci5yb3V0ZScpXHJcbnZhciBkb2NSb3V0ZXIgPSByZXF1aXJlKCcuL3JvdXRlcy9kb2N1bWVudC5yb3V0ZScpXHJcbnZhciBtZXNzYWdlUm91dGVyID0gcmVxdWlyZSgnLi9yb3V0ZXMvbWVzc2FnZS5yb3V0ZScpXHJcblxyXG5cclxudmFyIGFwcCA9IGV4cHJlc3MoKVxyXG5cclxudHJ5IHtcclxuXHRtb25nb29zZS5jb25uZWN0KFxyXG5cdFx0cHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT0gJ3Rlc3QnXHJcblx0XHRcdD8gcHJvY2Vzcy5lbnYuREJfUEFUSF9URVNUXHJcblx0XHRcdDogcHJvY2Vzcy5lbnYuREJfUEFUSCxcclxuXHRcdHtcclxuXHRcdFx0dXNlTmV3VXJsUGFyc2VyOiB0cnVlLFxyXG5cdFx0XHR1c2VVbmlmaWVkVG9wb2xvZ3k6IHRydWUsXHJcblx0XHRcdHVzZUZpbmRBbmRNb2RpZnk6IHRydWVcclxuXHRcdH1cclxuXHQpXHJcbn0gY2F0Y2ggKGVycm9yKSB7XHJcblx0Y29uc29sZS5lcnJvcihlcnJvci5tZXNzYWdlKVxyXG5cdHByb2Nlc3MuZXhpdCgxKVxyXG59XHJcbm1vbmdvb3NlLnNldCgndXNlQ3JlYXRlSW5kZXgnLCB0cnVlKVxyXG5cclxucHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJ1xyXG5cdD8gYXBwLnVzZShjb21wcmVzc2lvbigpKS51c2UoaGVsbWV0KCkpXHJcblx0OiBudWxsXHJcblxyXG4vLyBsb2dnaW5nIHNldHVwIChjaGVjayBpZiB1c2luZyB0ZXN0IGVudilcclxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAndGVzdCcpIHtcclxuXHRhcHAudXNlKFxyXG5cdFx0bG9nZ2VyKCdbIDpkYXRlW3dlYl0gXSA6bWV0aG9kIDp1cmwgLSA6c3RhdHVzIGluIDpyZXNwb25zZS10aW1lWzNdIG1zJywge1xyXG5cdFx0XHRza2lwOiBmdW5jdGlvbiAocmVxLCByZXMpIHtcclxuXHRcdFx0XHRyZXR1cm4gcmVzLnN0YXR1c0NvZGUgPCA0MDBcclxuXHRcdFx0fSxcclxuXHRcdH0pXHJcblx0KVxyXG5cdGFwcC51c2UoXHJcblx0XHRsb2dnZXIoJ1sgOmRhdGVbd2ViXSBdIDptZXRob2QgOnVybCAtIDpyZW1vdGUtYWRkcicsIHtcclxuXHRcdFx0c3RyZWFtOiBmcy5jcmVhdGVXcml0ZVN0cmVhbShwYXRoLmpvaW4oX19kaXJuYW1lLCAnYWNjZXNzLmxvZycpLCB7XHJcblx0XHRcdFx0ZmxhZ3M6ICdhJyxcclxuXHRcdFx0fSksXHJcblx0XHR9KVxyXG5cdClcclxufVxyXG5cclxuYXBwLnVzZShjb3JzKHsgb3JpZ2luOiAnKicgfSkpXHJcbi8vIGFwcC5vcHRpb25zKCcqJywgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkgPT4ge1xyXG4vLyBcdHJlcy5oZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbicsICcqJylcclxuLy8gXHRyZXMuaGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzJywgJyonKVxyXG4vLyBcdHJlcy5oZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnLCAnKicpXHJcbi8vIFx0Ly9yZXMuaGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1DcmVkZW50aWFscycsICcqJylcclxuLy8gXHRjb25zb2xlLmxvZygnUFJFRkxJR0hUJylcclxuXHJcbi8vIFx0cmVzLmVuZCgpXHJcbi8vIH0pXHJcbmFwcC51c2UoZXhwcmVzcy5qc29uKCkpXHJcbmFwcC51c2UoZXhwcmVzcy51cmxlbmNvZGVkKHsgZXh0ZW5kZWQ6IHRydWUgfSkpXHJcblxyXG5hcHAudXNlKCcvdXNlcicsIHVzZXJzUm91dGVyKVxyXG5hcHAudXNlKCcvZG9jdW1lbnQnLCBkb2NSb3V0ZXIpXHJcbmFwcC51c2UoJy9tZXNzYWdlJywgbWVzc2FnZVJvdXRlcilcclxuYXBwLnVzZSgnLycsIGluZGV4Um91dGVyKVxyXG5cclxuLy8gZXJyb3IgaGFuZGxlclxyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcclxuYXBwLnVzZShmdW5jdGlvbiAoZXJyOiBFcnJvckhhbmRsZXIsIHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSB7XHJcblx0Y29uc29sZS5lcnJvcihlcnIpXHJcblx0aGFuZGxlRXJyb3IoZXJyLCByZXMpXHJcbn0pXHJcblxyXG5hcHAudXNlKChyZXEsIHJlcykgPT4ge1xyXG5cdHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgZXJyb3I6ICdSb3V0ZSBub3QgZm91bmQnIH0pXHJcbn0pXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFwcFxyXG4iXX0=