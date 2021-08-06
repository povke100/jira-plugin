AJS.test.require(["jira.webresources:color-picker"],function(){"use strict";var e=require("backbone"),o=require("jquery");module("Color picker input view component",{setup:function(){this.sandbox=sinon.sandbox.create(),this.stubColorPicker(),this.model=new e.Model({color:"black",colorDefined:!0});var o=require("jira/components/color-picker/view/color-picker-input-view").extend({el:"#qunit-fixture"});this.colorPickerView=new o({model:this.model}),this.onColorSelectedStub=this.sandbox.stub(),this.colorPickerView.on("color:selected",this.onColorSelectedStub),this.colorPickerView.render()},stubColorPicker:function(){var e=this;this.sandbox.stub(o.fn,"ColorPicker",function(o){e.colorPickerOnSubmit=o.onSubmit,e.colorPickerOnChange=o.onChange}),this.sandbox.stub(o.fn,"ColorPickerSetColor"),this.sandbox.stub(o.fn,"ColorPickerShow"),this.sandbox.stub(o.fn,"ColorPickerHide")},teardown:function(){this.sandbox.restore()},getInput:function(){return o("#qunit-fixture input")},getPreview:function(){return o("#qunit-fixture .color-preview")},triggerKeyUp:function(e){this.getInput().val(e),this.getInput().trigger("keyup")}}),test("When model triggers color change, input field changes value",function(){equal(this.getInput().val(),"black"),equal(this.getPreview().get(0).style.backgroundColor,"black"),this.model.set("color","yellow"),equal(this.getInput().val(),"yellow"),equal(this.getPreview().get(0).style.backgroundColor,"yellow"),ok(this.getInput().ColorPickerSetColor.calledOnce),ok(this.getInput().ColorPickerSetColor.calledWith("yellow"))}),test("When model triggers color defined change, color preview may disappear",function(){this.model.set("colorDefined",!0),ok(this.getPreview().is(":visible")),this.model.set("colorDefined",!1),notOk(this.getPreview().is(":visible"))}),test("When someone type into field, event is triggered",function(){ok(this.onColorSelectedStub.notCalled);this.triggerKeyUp("new value"),ok(this.onColorSelectedStub.calledOnce),ok(this.onColorSelectedStub.calledWith("new value"));this.triggerKeyUp("new value version 2"),ok(this.onColorSelectedStub.calledTwice),ok(this.onColorSelectedStub.calledWith("new value version 2"))}),test("When someone change value in color picker, event is triggered",function(){ok(this.onColorSelectedStub.notCalled);this.colorPickerOnChange("color","new val"),ok(this.onColorSelectedStub.calledOnce),ok(this.onColorSelectedStub.calledWith("#new val")),ok(this.getInput().ColorPickerHide.notCalled)}),test("When someone submit value in color picker, event is triggered and picker is hidden",function(){ok(this.onColorSelectedStub.notCalled),ok(this.getInput().ColorPickerHide.notCalled);this.colorPickerOnSubmit("color","new val 2"),ok(this.onColorSelectedStub.calledOnce),ok(this.onColorSelectedStub.calledWith("#new val 2")),ok(this.getInput().ColorPickerHide.calledOnce)})});