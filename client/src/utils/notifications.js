import axios from "axios";

export const newNotification = (notification, users) => {
  users.forEach(user => {
    postNotification(user, notification);
  });
};

export const newParentNotification = async (notification, users) => {
  let kidIds = {
    kid_ids: [...users]
  };
  axios
    .patch(`${process.env.REACT_APP_NODE_API}/api/kids`, kidIds)
    .then(kids => {
      if (kids.data.success) {
        kids.data.data.forEach(kid => {
          kid.parents.forEach(parent => {
            const queryParams = "?rol=3";
            postNotification(parent, notification, queryParams);
          });
        });
      }
    })
    .catch(err => {
      console.log(err);
      return [];
    });
};

export const notificationForAdmins = async notification => {
  axios
    .get(`${process.env.REACT_APP_NODE_API}/api/users?rol=1`)
    .then(admins => {
      if (admins.data.success) {
        admins.data.data.forEach(user => {
          postNotification(user._id, notification);
        });
      }
    })
    .catch(err => {
      console.log(err);
      return [];
    });
};

const postNotification = async (userId, request, queryParams = "") => {
  axios
    .post(
      `${process.env.REACT_APP_NODE_API}/api/users/${userId}/notification${queryParams}`,
      request
    )
    .then(response => {
      console.log("new notification", response);
    })
    .catch(error => {
      console.log(error);
    });
};
