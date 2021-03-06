"use strict";

var _index = require("../controller/index.controller");

var express = require('express');

var router = express.Router();

/**
 * @api {get} / Server health
 * @apiName serverPingHealth
 * @apiGroup Root
 * @apiDescription Returns information on the server health
 * @apiSuccess {Object} healt Server health information
 * @apiError (500) InternalServerError Something went wron processing your request
 */
router.route('/').get([_index.checkMongoDBHealth, _index.checkRedisHealth], function (req, res) {
  res.status(200).json(res.locals.health);
});
module.exports = router;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yb3V0ZXMvaW5kZXgucm91dGUudHMiXSwibmFtZXMiOlsiZXhwcmVzcyIsInJlcXVpcmUiLCJyb3V0ZXIiLCJSb3V0ZXIiLCJyb3V0ZSIsImdldCIsImNoZWNrTW9uZ29EQkhlYWx0aCIsImNoZWNrUmVkaXNIZWFsdGgiLCJyZXEiLCJyZXMiLCJzdGF0dXMiLCJqc29uIiwibG9jYWxzIiwiaGVhbHRoIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFHQTs7QUFIQSxJQUFJQSxPQUFPLEdBQUdDLE9BQU8sQ0FBQyxTQUFELENBQXJCOztBQUNBLElBQUlDLE1BQU0sR0FBR0YsT0FBTyxDQUFDRyxNQUFSLEVBQWI7O0FBSUE7Ozs7Ozs7O0FBUUFELE1BQU0sQ0FBQ0UsS0FBUCxDQUFhLEdBQWIsRUFBa0JDLEdBQWxCLENBQXNCLENBQUNDLHlCQUFELEVBQXFCQyx1QkFBckIsQ0FBdEIsRUFBOEQsVUFBQ0MsR0FBRCxFQUFNQyxHQUFOLEVBQWM7QUFDM0VBLEVBQUFBLEdBQUcsQ0FBQ0MsTUFBSixDQUFXLEdBQVgsRUFBZ0JDLElBQWhCLENBQXFCRixHQUFHLENBQUNHLE1BQUosQ0FBV0MsTUFBaEM7QUFDQSxDQUZEO0FBSUFDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQmIsTUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MnKVxudmFyIHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKClcblxuaW1wb3J0IHsgY2hlY2tNb25nb0RCSGVhbHRoLCBjaGVja1JlZGlzSGVhbHRoIH0gZnJvbSAnLi4vY29udHJvbGxlci9pbmRleC5jb250cm9sbGVyJztcblxuLyoqXG4gKiBAYXBpIHtnZXR9IC8gU2VydmVyIGhlYWx0aFxuICogQGFwaU5hbWUgc2VydmVyUGluZ0hlYWx0aFxuICogQGFwaUdyb3VwIFJvb3RcbiAqIEBhcGlEZXNjcmlwdGlvbiBSZXR1cm5zIGluZm9ybWF0aW9uIG9uIHRoZSBzZXJ2ZXIgaGVhbHRoXG4gKiBAYXBpU3VjY2VzcyB7T2JqZWN0fSBoZWFsdCBTZXJ2ZXIgaGVhbHRoIGluZm9ybWF0aW9uXG4gKiBAYXBpRXJyb3IgKDUwMCkgSW50ZXJuYWxTZXJ2ZXJFcnJvciBTb21ldGhpbmcgd2VudCB3cm9uIHByb2Nlc3NpbmcgeW91ciByZXF1ZXN0XG4gKi9cbnJvdXRlci5yb3V0ZSgnLycpLmdldChbY2hlY2tNb25nb0RCSGVhbHRoLCBjaGVja1JlZGlzSGVhbHRoXSwgKHJlcSwgcmVzKSA9PiB7XG5cdHJlcy5zdGF0dXMoMjAwKS5qc29uKHJlcy5sb2NhbHMuaGVhbHRoKVxufSlcblxubW9kdWxlLmV4cG9ydHMgPSByb3V0ZXJcbiJdfQ==