AJS.test.require("jira.webresources:jira-setup", function () {
    var $ = require("jquery");
    var _ = require("underscore");
    var View = require("jira/setup/setup-finishing-layout");

    var markup = JIRA.Templates.Setup.layoutContent({
        content: JIRA.Templates.Setup.Finishing.pageContent({})
    });

    module("JIRA SetupFinishing page", {
        setup: function setup() {
            var className = "jira-setup-finishing-page";

            this.sandbox = sinon.sandbox.create({
                useFakeServer: true,
                useFakeTimers: true
            });

            $("#qunit-fixture").append($("<div></div>").addClass(className).html(markup));

            this.initializeView = function () {
                this.view = new View({
                    el: "." + className
                });
            };
        },

        currentView: function currentView() {
            return this.view.contents.currentView;
        },

        teardown: function teardown() {
            window.onbeforeunload = null;
            this.sandbox.restore();
            this.view.close();
            this.view.remove();
        },

        assertSteps: function assertSteps(steps) {
            var view = this.currentView();

            _.each(steps, _.bind(function (step, index) {
                var $item = view.ui.notificationsItem.eq(index);
                var status = this.getStatus($item);

                equal($item.data("step-key"), step.key, "expecting notification step (" + step.key + ")");
                equal(status, step.status, "expecting notification step (" + step.key + ") to have given status (" + step.status + ")");
            }, this));
        },

        getStatus: function getStatus($item) {
            var status = "unknown";

            if ($item.find(".aui-icon-wait").length === 1) {
                status = "pending";
            } else if ($item.find(".jira-setup-finishing-notifications-placeholder-icon").length === 1) {
                if ($item.find(".jira-setup-finishing-notifications-inactive").length === 1) {
                    status = "awaiting";
                }
            } else if ($item.find(".aui-iconfont-approve").length === 1) {
                status = "success";
            } else if ($item.find(".aui-iconfont-info").length === 1) {
                status = "failure";
            }

            return status;
        },

        hasLagMessage: function hasLagMessage(key) {
            var view = this.currentView();

            return view.ui.notificationsItem.filter('[data-step-key="' + key + '"]').find(".jira-setup-finishing-notifications-lag").length === 1;
        },

        stepsForResponse: function stepsForResponse(steps) {
            var r = {};

            _.each(steps, function (step) {
                r[step.key] = step.status;
            });

            return r;
        },

        steps: {
            "databasePending": [{ key: "database", status: "pending" }, { key: "plugins", status: "awaiting" }, { key: "environment", status: "awaiting" }, { key: "finishing", status: "awaiting" }],
            "databaseFailure": [{ key: "database", status: "failure" }, { key: "plugins", status: "awaiting" }, { key: "environment", status: "awaiting" }, { key: "finishing", status: "awaiting" }],
            "pluginsPending": [{ key: "database", status: "success" }, { key: "plugins", status: "pending" }, { key: "environment", status: "awaiting" }, { key: "finishing", status: "awaiting" }],
            "pluginsFailure": [{ key: "database", status: "success" }, { key: "plugins", status: "failure" }, { key: "environment", status: "awaiting" }, { key: "finishing", status: "awaiting" }],
            "environmentPending": [{ key: "database", status: "success" }, { key: "plugins", status: "success" }, { key: "environment", status: "pending" }, { key: "finishing", status: "awaiting" }],
            "environmentFailure": [{ key: "database", status: "success" }, { key: "plugins", status: "success" }, { key: "environment", status: "failure" }, { key: "finishing", status: "awaiting" }],
            "finishingPending": [{ key: "database", status: "success" }, { key: "plugins", status: "success" }, { key: "environment", status: "success" }, { key: "finishing", status: "pending" }],
            "finishingFailure": [{ key: "database", status: "success" }, { key: "plugins", status: "success" }, { key: "environment", status: "success" }, { key: "finishing", status: "failure" }],
            "finishingSuccess": [{ key: "database", status: "success" }, { key: "plugins", status: "success" }, { key: "environment", status: "success" }, { key: "finishing", status: "success" }]
        }
    });

    test("database task should be marked as pending by default and tasks should be in correct order", function () {
        this.initializeView();
        this.assertSteps(this.steps.databasePending);
    });

    test("lag message is visible if a single step takes longer than 15 seconds", function () {
        var expectedSteps = this.steps.environmentPending;
        var response = {
            steps: this.stepsForResponse(expectedSteps)
        };

        this.initializeView();
        this.sandbox.server.requests[0].respond(200, { "Content-Type": "application/json" }, JSON.stringify({ result: "OK" }));

        this.sandbox.clock.tick(15001);

        ok(this.hasLagMessage("database"), "database step has lag message");
        this.sandbox.server.requests[1].respond(200, { "Content-Type": "application/json" }, JSON.stringify(response));

        this.assertSteps(expectedSteps);
        ok(!this.hasLagMessage("database"), "database step has no lag message");
        ok(!this.hasLagMessage("environment"), "environment step has no lag message");

        this.sandbox.clock.tick(15001);
        ok(!this.hasLagMessage("database"), "database step has no lag message");
        ok(this.hasLagMessage("environment"), "environment step has lag message");
    });

    test("if setting up database fails, an error message is shown", function () {
        var errorMessage = "The fancy error message.";
        var expectedSteps = this.steps.databaseFailure;
        var response = {
            steps: this.stepsForResponse(expectedSteps),
            errorMessage: errorMessage
        };

        this.initializeView();
        this.sandbox.server.requests[0].respond(200, { "Content-Type": "application/json" }, JSON.stringify({ result: "OK" }));
        this.sandbox.server.requests[1].respond(200, { "Content-Type": "application/json" }, JSON.stringify(response));

        equal(this.sandbox.server.requests.length, 2, "there are exxactly two requests to the server");
        this.assertSteps(expectedSteps);
        ok(this.currentView().ui.errorMessage.text().indexOf(errorMessage) !== -1, "error message has correct content");
    });

    test("if restarting plugin system fails, an error message is shown", function () {
        var errorMessage = "The fancy error message.";
        var expectedSteps1 = this.steps.pluginsPending;
        var expectedSteps2 = this.steps.pluginsFailure;

        var response1 = {
            steps: this.stepsForResponse(expectedSteps1)
        };
        var response2 = {
            steps: this.stepsForResponse(expectedSteps2),
            errorMessage: errorMessage
        };

        this.initializeView();
        this.sandbox.server.requests[0].respond(200, { "Content-Type": "application/json" }, JSON.stringify({ result: "OK" }));

        this.sandbox.server.requests[1].respond(200, { "Content-Type": "application/json" }, JSON.stringify(response1));
        this.assertSteps(expectedSteps1);
        this.sandbox.clock.tick(1);

        this.sandbox.server.requests[2].respond(200, { "Content-Type": "application/json" }, JSON.stringify(response2));
        this.assertSteps(expectedSteps2);

        equal(this.sandbox.server.requests.length, 3, "there are only three requests to the server");
        ok(this.currentView().ui.errorMessage.text().indexOf(errorMessage) !== -1, "error message has correct content");
    });

    test("if setting up environment fails, an error message is shown", function () {
        var errorMessage = "The fancy error message.";
        var expectedSteps1 = this.steps.pluginsPending;
        var expectedSteps2 = this.steps.environmentPending;
        var expectedSteps3 = this.steps.environmentFailure;

        var response1 = {
            steps: this.stepsForResponse(expectedSteps1)
        };
        var response2 = {
            steps: this.stepsForResponse(expectedSteps2)
        };
        var response3 = {
            steps: this.stepsForResponse(expectedSteps3),
            errorMessage: errorMessage
        };

        this.initializeView();
        this.sandbox.server.requests[0].respond(200, { "Content-Type": "application/json" }, JSON.stringify({ result: "OK" }));

        this.sandbox.server.requests[1].respond(200, { "Content-Type": "application/json" }, JSON.stringify(response1));
        this.assertSteps(expectedSteps1);
        this.sandbox.clock.tick(1);

        this.sandbox.server.requests[2].respond(200, { "Content-Type": "application/json" }, JSON.stringify(response2));
        this.assertSteps(expectedSteps2);
        this.sandbox.clock.tick(1);

        this.sandbox.server.requests[3].respond(200, { "Content-Type": "application/json" }, JSON.stringify(response3));
        this.assertSteps(expectedSteps3);

        equal(this.sandbox.server.requests.length, 4, "there are only four requests to the server");
        ok(this.currentView().ui.errorMessage.text().indexOf(errorMessage) !== -1, "error message has correct content");
    });

    test("if the last phase of setup fails, an error message is shown", function () {
        var errorMessage = "The fancy error message.";
        var expectedSteps1 = this.steps.pluginsPending;
        var expectedSteps2 = this.steps.environmentPending;
        var expectedSteps3 = this.steps.finishingPending;
        var expectedSteps4 = this.steps.finishingFailure;

        var response1 = {
            steps: this.stepsForResponse(expectedSteps1)
        };
        var response2 = {
            steps: this.stepsForResponse(expectedSteps2)
        };
        var response3 = {
            steps: this.stepsForResponse(expectedSteps3)
        };
        var response4 = {
            steps: this.stepsForResponse(expectedSteps4),
            errorMessage: errorMessage
        };

        this.initializeView();
        this.sandbox.server.requests[0].respond(200, { "Content-Type": "application/json" }, JSON.stringify({ result: "OK" }));

        this.sandbox.server.requests[1].respond(200, { "Content-Type": "application/json" }, JSON.stringify(response1));
        this.assertSteps(expectedSteps1);
        this.sandbox.clock.tick(1);

        this.sandbox.server.requests[2].respond(200, { "Content-Type": "application/json" }, JSON.stringify(response2));
        this.assertSteps(expectedSteps2);
        this.sandbox.clock.tick(1);

        this.sandbox.server.requests[3].respond(200, { "Content-Type": "application/json" }, JSON.stringify(response3));
        this.assertSteps(expectedSteps3);
        this.sandbox.clock.tick(1);

        this.sandbox.server.requests[4].respond(200, { "Content-Type": "application/json" }, JSON.stringify(response4));
        this.assertSteps(expectedSteps4);

        equal(this.sandbox.server.requests.length, 5, "there are only five requests to the server");
        ok(this.currentView().ui.errorMessage.text().indexOf(errorMessage) !== -1, "error message has correct content");
    });

    test("after setup completes successfully, notifications are replaced with summary view", function () {
        var expectedSteps1 = this.steps.pluginsPending;
        var expectedSteps2 = this.steps.environmentPending;
        var expectedSteps3 = this.steps.finishingPending;
        var expectedSteps4 = this.steps.finishingSuccess;
        var url = "http://localhost:8090/jira/";

        this.initializeView();
        this.sandbox.server.requests[0].respond(200, { "Content-Type": "application/json" }, JSON.stringify({ result: "OK" }));

        this.sandbox.server.requests[1].respond(200, { "Content-Type": "application/json" }, JSON.stringify({ steps: this.stepsForResponse(expectedSteps1) }));
        this.assertSteps(expectedSteps1);
        this.sandbox.clock.tick(1);

        this.sandbox.server.requests[2].respond(200, { "Content-Type": "application/json" }, JSON.stringify({ steps: this.stepsForResponse(expectedSteps2) }));
        this.assertSteps(expectedSteps2);
        this.sandbox.clock.tick(1);

        this.sandbox.server.requests[3].respond(200, { "Content-Type": "application/json" }, JSON.stringify({ steps: this.stepsForResponse(expectedSteps3) }));
        this.assertSteps(expectedSteps3);
        this.sandbox.clock.tick(1);

        this.sandbox.server.requests[4].respond(200, { "Content-Type": "application/json" }, JSON.stringify({ steps: this.stepsForResponse(expectedSteps4) }));
        this.assertSteps(expectedSteps4);
        this.sandbox.clock.tick(1);

        this.sandbox.server.requests[5].respond(200, { "Content-Type": "application/json" }, JSON.stringify({ redirectUrl: url }));

        equal(this.sandbox.server.requests.length, 6, "there are only six requests to the server");

        this.sandbox.clock.tick(3000);
        var view = this.currentView();

        equal(view.ui.summary.text(), "setup.finishing.finished.description", "summary view is rendered");

        equal(view.ui.annotation.data("redirect-url"), url, "summary view has a link to dashboard / whatever");
    });

    test("if request times out, a warning is shown to the user", function () {
        var warningPresent = _.bind(function (isPresent, assertionText) {
            var warning = this.currentView().ui.timeoutWarning;

            if (isPresent) {
                notEqual(warning.length, 0, assertionText);

                ok(!warning.hasClass("aui-message-error"), "timeout message should never be of error type");
                ok(warning.hasClass("aui-message-warning"), "timeout message is of warning type");
            } else {
                equal(warning.length, 0, assertionText);
            }
        }, this);

        this.initializeView();
        this.sandbox.server.requests[0].respond(200, { "Content-Type": "application/json" }, JSON.stringify({ result: "OK" }));

        this.sandbox.server.requests[1].respond(200, { "Content-Type": "application/json" }, JSON.stringify({ steps: this.stepsForResponse(this.steps.environmentPending) }));

        this.sandbox.clock.tick(299000);
        this.assertSteps(this.steps.environmentPending);
        ok(this.hasLagMessage("environment"), "environment step has lag message");
        warningPresent(false, "has no warning before timeout");

        this.sandbox.clock.tick(1001);
        this.assertSteps(this.steps.environmentPending);
        ok(!this.hasLagMessage("environment"), "environment step has no lag message after timeout");
        warningPresent(true, "warning present after timeout");

        this.assertSteps(this.steps.environmentPending);
        ok(!this.hasLagMessage("environment"), "environment step has no lag message");

        this.sandbox.clock.tick(300001);
        ok(!this.hasLagMessage("environment"), "environment step has no lag message after timeout");
        warningPresent(true, "has timeout message for the second time");

        // let the setup continue and see if it will finish successfully
        this.sandbox.server.requests[4].respond(200, { "Content-Type": "application/json" }, JSON.stringify({ steps: this.stepsForResponse(this.steps.finishingSuccess) }));
        this.assertSteps(this.steps.finishingSuccess);
        this.sandbox.clock.tick(1);

        this.sandbox.server.requests[5].respond(200, { "Content-Type": "application/json" }, JSON.stringify({ redirectUrl: "whatever" }));

        equal(this.sandbox.server.requests.length, 6, "there were only six requests to the server");

        this.sandbox.clock.tick(3000);

        equal(this.currentView().ui.summary.text(), "setup.finishing.finished.description", "summary view is rendered");
    });

    test("onbeforeunload is a function", function () {
        this.initializeView();
        this.sandbox.stub(this.currentView(), "bootstrapStatePulling");

        equal(window.onbeforeunload(), "setup.finishing.navigation.warning");
        this.sandbox.clock.tick(1);
        sinon.assert.calledOnce(this.currentView().bootstrapStatePulling);
    });
});