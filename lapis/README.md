# Lapis Automod
Lapis Automod helps protect your Minecraft realm by moderating actions.

<p align="center">
    <img src="https://img.shields.io/github/issues/Lapis-Utilities/Lapis-Automod?label=ISSUES%20OPEN&style=for-the-badge" alt="Issues Open">  
    <img src="https://img.shields.io/github/commit-activity/m/Lapis-Utilities/Lapis-Automod?style=for-the-badge" alt="Commits Per Week"> 
    <img src="https://img.shields.io/github/last-commit/Lapis-Utilities/Lapis-Automod?style=for-the-badge" alt="Last Commit">
</p>

## Setup
- You need to set up a MongoDB database and put the database URL in the .env file.

## Detections in the Code
- The code contains various detections related to player actions, such as checking for valid skin information, device IDs, platform chat IDs, and more.

### Player List Event Handler
- The "player_list" event handler processes the incoming player records and performs the following checks:
  - Check for valid Xbox user ID and store it in a user map.
  - Validate skin information by checking skin IDs, dimensions, and such.
  - Verify the platform and platform chat ID for Nintendo Switch.

### Add Player Event Handler
- The "add_player" event handler processes the incoming player data and performs the following checks:
  - Validate the device ID and device OS against the user's account.
  - Check for too many linked device IDs and kick the player if necessary.
  - Validate the device OS specific device IDs based on the platform.
  - Verify the platform and platform chat ID for Nintendo Switch.
  - Check for unsupported or unknown device models and kick the player as necessary.

### Emote Event Handler
- The "emote" event handler processes the incoming emote data and performs the following checks:
  - Verify the emote flags and kick the player if necessary.
  - Validate the emote ID.

### Animate Event Handler
- The "animate" event handler processes the incoming animation data and performs the following checks:
  - Check if a user has the "boat_rowing_time" when it is not the row_left or row_right.
  - Check for unknown or none animations.

### Move Event Handler
- The "move" event handler processes the incoming move data and performs the following checks:
  - Checks if the player is above 323 in the y-axis.
  - Checks if the player is more than 5,000,000 on x-axis or z-axis.

## How to Contribute
Feel free to contribute by creating a pull request anytime.

## License
This project is licensed under the AGPL-3.0 License. Please see the [LICENSE](./LICENSE) file for more details.
