var requested_photos = new Vue({
    el: "#requested-photos",
    data: {
        new_requested_photo: "",
        requested_photos: [
            'Front View of Home',
            'View from Front of Home',
            'Street View Facing One Direction',
            'Street view facing other direction',
            'Kitchen',
            'Living Room',
            'Bedroom',
            'Bathroom',
            'Basement',
            'Garage'
        ]
    },
    methods: {
        add_requested_photo: function () {
            this.requested_photos.push(this.new_requested_photo);
            this.new_requested_photo = "";
        },
        remove_requested_photo: function(index) {
            this.requested_photos.splice(index, 1)
        }
    }
});

var requested_files = new Vue({
    el: "#requested-files",
    data: {
        new_requested_file: "",
        requested_files: [
            'Purchase and Sales Agreement',
            'Deed',
            'Renovation List',
            'Condo Questionnaire',
        ]
    },
    methods: {
        add_requested_file: function () {
            this.requested_files.push(this.new_requested_file);
            this.new_requested_file = "";
        },
        remove_requested_file: function(index) {
            this.requested_files.splice(index, 1)
        }
    }
});