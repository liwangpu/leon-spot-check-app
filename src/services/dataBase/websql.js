"use strict";

exports.__esModule = true;

var WebSql = (function () {

	function WebSql() { }

	WebSql.prototype.openDatabase = function (dbname) {
		if (window.openDatabase) {
			// console.log('web db is ok .');
			return window.openDatabase(dbname ? dbname : 'pmshub.db', "1.0", "Cordova Demo", 4 * 1024 * 1024, function () {
				// console.log("web db created ");
			});

		}
		return false;
	}
	return WebSql;
}());

exports.WebSql = WebSql;