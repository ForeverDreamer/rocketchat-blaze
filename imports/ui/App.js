import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { TasksCollection } from "../api/TasksCollection";
import './App.html';
import './Task.js';
import './Login';

const HIDE_COMPLETED_STRING = "hideCompleted";
const IS_LOADING_STRING = "isLoading";
const getUser = () => Meteor.user();
const isUserLogged = () => !!getUser();


const getTasksFilter = () => {
    const user = getUser();

    const hideCompletedFilter = { isChecked: { $ne: true } };

    const userFilter = user ? { userId: user._id } : {};

    const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };

    return { userFilter, pendingOnlyFilter };
}

Template.body.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();

    const handler = Meteor.subscribe('tasks');
    Tracker.autorun(() => {
        this.state.set(IS_LOADING_STRING, !handler.ready());
    });
});

Template.body.helpers({
    tasks() {
        const instance = Template.instance();
        const hideCompleted = instance.state.get(HIDE_COMPLETED_STRING);

        const { pendingOnlyFilter, userFilter } = getTasksFilter();

        if (!isUserLogged()) {
            return [];
        }

        return TasksCollection.find(hideCompleted ? pendingOnlyFilter : userFilter, {
            sort: { createdAt: -1 },
        }).fetch();
    },
    hideCompleted() {
        return Template.instance().state.get(HIDE_COMPLETED_STRING);
    },
    incompleteCount() {
        if (!isUserLogged()) {
            return '';
        }

        const { pendingOnlyFilter } = getTasksFilter();

        const incompleteTasksCount = TasksCollection.find(pendingOnlyFilter).count();
        return incompleteTasksCount ? `(${incompleteTasksCount})` : '';
    },
    isUserLogged() {
        return isUserLogged();
    },
    getUser() {
        return getUser();
    },
    isLoading() {
        const instance = Template.instance();
        return instance.state.get(IS_LOADING_STRING);
    },
});

Template.body.events({
    "click #hide-completed-button"(event, instance) {
        const currentHideCompleted = instance.state.get(HIDE_COMPLETED_STRING);
        instance.state.set(HIDE_COMPLETED_STRING, !currentHideCompleted);
    },
    'click .user'() {
        Meteor.logout();
    }
})

Template.form.events({
    "submit .task-form"(event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        const target = event.target;
        const text = target.text.value;

        // Insert a task into the collection
        Meteor.call('tasks.insert', text);

        // Clear form
        target.text.value = '';
    },
})
