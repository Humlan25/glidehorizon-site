# GlideHorizon User Manual

Updated: 5 November 2026.

This manual describes the current experimental Android application. Some builds
are labelled **GlideHorizon Bench**. Features and menu names may differ in older
versions; use the instructions for the version you have installed.

## Contents

1. [Important limitations](#important-limitations)
2. [Requirements and installation](#requirements-and-installation)
3. [Getting started](#getting-started)
4. [Reading the display](#reading-the-display)
5. [Orientation and ground calibration](#orientation-and-ground-calibration)
6. [Display controls](#display-controls)
7. [Altitude, QNH and flight level](#altitude-qnh-and-flight-level)
8. [GPS speed and reference markings](#gps-speed-and-reference-markings)
9. [Correction gain](#correction-gain) and [gyro low-pass](#gyro-low-pass-experimental)
10. [Connecting to XCSoar](#connecting-to-xcsoar)
11. [Background operation and notifications](#background-operation-and-notifications)
12. [Recording and diagnostics](#recording-and-diagnostics)
13. [Troubleshooting](#troubleshooting)
14. [Menu reference](#menu-reference)
15. [Licenses and donations](#licenses-and-donations)

## Important Limitations

**GlideHorizon is experimental software, not a certified or flight-qualified
instrument. Do not use it as a primary or emergency attitude reference, or as a
means of flying without external visual reference.**

The app estimates attitude from the phone's gyroscope and accelerometer. A
plausible-looking horizon can be wrong. Sensor status and a running notification
are not guarantees of correct attitude.

Keep these distinctions in mind:

- Vehicle acceleration can be mistaken for tilt. Forward acceleration may
  produce an apparent pitch change; turning can distort roll. Coordinated
  aircraft turns do not eliminate this limitation.
- Reducing accelerometer correction trades acceleration-induced error against
  gyro drift. No correction-gain setting guarantees accurate aircraft attitude.
- GPS speed is ground speed, not indicated or true airspeed. Coloured speed
  references must not be used to decide stall, manoeuvring or overspeed safety.
- The ground grid is a visual reference plane, not terrain, synthetic vision
  or a ground-clearance indication.
- Phone altitude and flight level are experimental pressure/GPS indications,
  not substitutes for approved aircraft altimetry.
- A second app on the same phone shares its display, power, hardware and
  operating system. It is not independent hardware redundancy.

Perform installation, mounting, calibration and configuration on the ground.
Do not allow operating or adjusting the app to distract from operating an aircraft.

## Requirements and Installation

GlideHorizon currently requires Android 8.0 or later. A compatible Android version
does not guarantee suitable sensors or reliable operation on every phone.

| Feature | Requirement |
| --- | --- |
| Attitude display | Working gyroscope and accelerometer |
| Magnetic heading reference | Suitable magnetometer data and usable attitude |
| Barometric altitude and flight level | Phone pressure sensor |
| GPS altitude and ground speed | GPS, device location enabled and precise-location permission |
| Another-device Wi-Fi feed | Shared trusted local network or hotspot |
| Bluetooth feed | Compatible paired devices supporting Bluetooth Classic SPP |

Install only an owner-authorized build from its approved distribution location.
Follow the accompanying release and license terms. This manual does not imply
that a production Google Play release is available.

If installing an APK directly, Android may require permission for the browser or
file manager to install apps from that source. Grant it only for a trusted source;
it can be disabled again afterward. Developer mode and USB debugging are not
required for ordinary installation and use.

### Updates and Existing Data

Android normally requires compatible signing keys for an in-place update.
Experimental builds may use different keys, so some updates cannot be installed
over an existing build.

**Uninstalling or clearing app storage erases private settings, calibration and
recordings.** Export recordings you need before doing either. Recording export
does not back up calibration or all settings. Do not assume Android backup will
restore the app's private data.

## Getting Started

1. Secure the phone in its intended mounting on the ground.
2. Open GlideHorizon. Sensor processing starts automatically; allow the estimator
   to settle.
3. Open the menu button near the upper-left of the instrument area.
4. Select **Display orientation** to match the intended screen orientation.
5. Complete **Ground calibration** using a known stationary reference.
6. Check pitch and bank response against known, safely controlled movements.
7. Choose optional tapes, grid or turn-indicator views in **Display elements**.
8. Configure **XCSoar feed** only if you want to send attitude to XCSoar.

Without an accepted mounting calibration, the initial mounting assumption is
phone upright, top up, screen toward the pilot. Do not treat that assumption as
valid for an arbitrary installation. XCSoar transmission requires an accepted
calibration and usable fresh attitude.

The optional altitude tape, GPS speed tape, flight-level box, reference grid,
turn overlay and turn-and-slip page default off. Display choices are remembered.
No aircraft-specific speed limits are supplied by default.

To stop the app's background work, select **Quit** or use **Stop horizon** in its
Android notification. Merely switching to another app does not stop processing.

## Reading the Display

### Horizon, Bank and Pitch

The fixed aircraft symbol is the reference for the moving horizon and pitch
ladder. Blue represents sky and brown represents the ground side of the horizon.
The bank scale indicates estimated roll.

Optional Speed and Alt tapes run down the sides to the heading/turn bar. Their
pointed boxes identify the current value on each scale. Smaller index marks
subdivide the numbered intervals.

### Heading and Relative Turn

The bar above the slip indicator displays heading or relative turn, depending
on the available reference. Its centre box shows the current value.

| Label or condition | Meaning |
| --- | --- |
| MAG | A magnetic heading reference has been established |
| MAG / HOLD | Heading is being propagated from the existing reference while magnetic correction is unavailable or unsuitable |
| REL | Relative turn, not an absolute compass heading |
| MAG WAIT or alignment wording | A suitable magnetic reference has not yet been established |
| Unavailable indication | No usable current turn/heading reference |

Magnetic heading is not true heading or GPS ground track. Nearby metal,
magnets, electrical equipment and the installation itself can affect it. The
magnetometer aligns the heading bar; it does not correct pitch and roll.

Relative turn can drift and resets when the estimator or reference restarts.
Do not interpret a relative zero as north.

### Slip Indicator

The ball at the bottom represents filtered lateral/vertical specific force in
the selected mounting frame. It is not a direct measurement of aerodynamic
sideslip angle. It can reach an end stop and is hidden when its input is
unavailable.

The ball is damped to reduce twitching from vibration. It deliberately responds
more slowly than the raw sensor signal, while following sustained lateral force.
This damping does not change the pitch/roll estimator or the Correction gain
setting. It cannot compensate for an insecure mounting or unusable sensor data.

### Turn Indicator and Turn-and-Slip Page

In **Display elements**, two independent switches control the turn instrument:

- **Turn indicator** adds a mechanical-style post above the heading/turn bar.
- **Turn and slip page** enables a separate page. Swipe left from the horizon to
   open it, and swipe right to return. This page shows the turn instrument,
   damped slip ball and compass, without the horizon, altitude/speed tapes or
   correction-gain readout.

In portrait, the round compass sits above the turn-and-slip dial. In landscape,
the dial is on the left and the compass is on the right. The layout adjusts
automatically while leaving the menu accessible. Both round instruments use
matching diameters, reduced only as needed to fit the available screen space.

The compass shows magnetic heading, not relative turn or rotation speed. Read
the curved card against the fixed centre line or use the numeric heading below.
N/E/S/W mark cardinal directions; other card numbers are tens of degrees, so
12 means 120 degrees. Larger nearby headings appear to the left of the centre
line, like a mechanical compass.

In **Diagnostics**, MAGNETIC indicates active magnetic correction and GYRO_HOLD
means propagation from an established magnetic reference. The compass omits the
changing mode label below its face. Without a reference, its card is empty and the
numeric heading shows dashes; relative turn is never substituted. The magnetometer's
quality checks can reject a nearby magnet as interference. This is not a separate
heading sensor, true-heading calculation or independent backup, and the styling
does not guarantee accuracy.

Both choices are saved and default off. The menu remains accessible on either
page. Swiping does not restart the sensors or change XCSoar transmission. Turn
off Turn and slip page to return to a single-page display. Swipe navigation is
disabled while a menu or settings panel is open.

The scale is in **degrees per minute**. The middle tick is zero turn rate; the
three marks on each side represent **one-third, two-thirds and the selected
maximum**. The centre and second marks are thicker than the others. Right
deflection indicates a right turn and left deflection a left turn.

Tap the maximum-scale number below either needle to open the **Turn scale** wheel.
Choose **60 to 720 degrees/minute in steps of 30**. The default is **540**, equivalent
to the previous 9 degrees/second range, with side ticks at 180, 360 and 540.
Drag the wheel or use the arrow buttons; the reset button selects 540. **Apply**
saves the scale for both indicators and future launches; **Cancel** discards the
preview. The label identifies the outer tick value, not the current rate. The
outer ticks remain at 45 degrees of needle deflection. Beyond them, the needle
continues proportionally to a horizontal 90-degree stop at twice the selected
value, in either direction. For example, with 540 selected, 810 degrees/minute
gives 67.5 degrees of deflection and 1080 reaches the stop. This extension has
no additional ticks; rates beyond the stop cannot be distinguished. Unavailable
data is indicated separately. Needle damping reduces rapid movements but adds response lag.

Both turn indicators use the same two-stage low-pass filter, with a 0.25-second
time constant per stage. A sustained change reaches roughly 90% indication after
one second, reducing rapid jitter without overshoot. This affects only the turn
indication, not pitch/roll estimation, raw recordings or the XCSoar attitude feed.

This indicates heading turn rate, not bank angle. It is calculated from calibrated
gyro rates and the untrimmed attitude estimate, not by differentiating magnetic
heading. Magnetic-reference corrections therefore do not directly move the needle.
Incorrect pitch/roll can still affect the projection: it is not an independent
gyro instrument or a way around the attitude estimator's limitations.

Missing rates, stale/held/invalid attitude and near-vertical pitch make the needle
unavailable after the bounded display hold, rather than falsely centred. The slip ball retains its own validity
rules. Important unavailable, held, test and recording indications can still
appear on the dedicated page. The DEGRADED label is omitted beneath this dial;
degraded status remains available in Diagnostics and on the main horizon.

### Status and Unavailable Data

| Indication | What to do or understand |
| --- | --- |
| Estimator settling / no attitude | Wait for initialization; investigate persistent sensor or mounting faults |
| DEGRADED | The estimate is still being updated, but its correction or quality is limited |
| ATTITUDE HELD / DISPLAY HELD with an age | A retained display, not current measurements; brief dropouts have a five-second hold limit |
| STALE DATA or other unavailable state | Do not interpret the display as a current attitude measurement |
| TRIM | A nonzero pitch display trim is active |
| GAIN with a value | A non-default correction gain is active; shown on the main horizon, not the dedicated turn-and-slip page |
| GYRO LPF with a frequency | Experimental pre-Fusion gyro filtering is enabled; it adds lag and affects local and transmitted attitude |
| REC / REC ERROR | Recording is active or has encountered a problem |
| `---` on an optional tape | The selected source is missing, stale or rejected |

When attitude becomes unusable, the app retains the previous usable sensor frame
for up to five seconds before clearing unavailable indications. The dedicated
turn/slip page also holds briefly when turn-rate calculation becomes unavailable.
**ATTITUDE HELD** or **DISPLAY HELD** shows the original measurement's increasing
age. Retained slip, compass and other indications are old data, not new readings.

Usable data resumes immediately when it returns. Continuous faults do not restart
the hold timer. Without an earlier usable frame, the app cannot invent one.
Stopping, changing orientation/calibration or starting a new session clears the
cache. Diagnostics and recordings still report actual sensor faults immediately;
the transmitter never uses the display cache as fresh attitude. Independent
pressure/GPS failures retain their existing freshness checks.

Altitude and speed have independent validity checks. Their presence does not
prove that the attitude is correct, and an attitude fault does not necessarily
invalidate a fresh altitude or speed reading.

## Orientation and Ground Calibration

### Display Orientation

Use **Display orientation** to choose portrait, landscape or the corresponding
inverted orientation.

Turning the phone by a quarter turn within its screen plane and choosing the
matching orientation can reuse the saved mounting calibration. Changing the
mount's inclination or which way the phone faces requires a new calibration.
An orientation change may briefly restart estimator settling.

Older calibrations may require confirmation of the orientation in which they
were created. Follow the prompt rather than guessing.

### Stationary Calibration

Use this when the forward mounting direction is known.

1. Stop any recording in **Diagnostics**, then open **Ground calibration**.
2. Select **Stationary**.
3. Choose **Phone back** if the phone's back points forward and the screen faces
   the pilot. Choose **Saved axis** only when that saved direction was previously
   verified and remains correct.
4. Enter **Known ground pitch (deg, nose-up +)**. Zero is appropriate only when
   the reference really is level in pitch.
5. Enter a useful **Mount / fold configuration** description.
6. Confirm that the installation is on the ground, stationary, wings level at
   the entered pitch, and that the selected forward direction is correct.
7. Tap **Capture reference**. Keep the phone and mounting completely still during
   the settling delay and three-second capture.
8. Review the result. Select **Accept and save** only if the reference and mounting
   assumptions were correct, then **Done**.

Stationary calibration estimates gyro bias and vertical alignment. It assumes,
rather than measures, the selected forward direction. Do not use Saved axis to
hide an unknown mounting direction.

### Wing-Tilt Calibration

Use **Wing tilts** when the roll-axis direction needs to be measured. Only perform
movements that are safe for the aircraft or bench fixture and its surroundings.

1. Establish and capture the same known stationary level reference as above.
2. Follow the prompt to lower the right wing or right side of the fixture, keeping
   pitch unchanged. Hold still and select **Capture right tilt**.
3. Move through level to a left-wing-down tilt. Hold still and select
   **Capture left tilt**.
4. Return to the original reference pose and select **Validate level**.
5. Review the measured movements and return check before **Accept and save**.

The app records gyro movement between the still captures, including any lifting,
twisting or repositioning of supports. Keep the motion about one consistent
fore-aft axis. The solver requires at least **95% of the measured rotation energy**
to align with that axis; a cross-axis failure reports the measured fit and the
right/left moving-sample counts. Passing the still captures does not guarantee
that the movements between them will pass.

For a flat, screen-up phone on a bench with its top edge pointing forward, a
secure lengthwise pivot can help produce repeatable right/left rocking. Keep the
pivot in place throughout and support the phone level for both reference captures.
Inserting or transferring a loose support between sides can introduce extra axes
of motion. Use a stable fixture, avoid accidental screen touches and cable pull,
and never perform this setup work in flight.

Cancelled or failed attempts preserve the previous saved calibration. After a
successful save, allow the estimator to settle and check its response again.

Opening calibration switches the XCSoar feed off. Re-enable it explicitly after
finishing and checking the result. Calibration is not flight qualification.

## Display Controls

### Pitch Display Trim

Open **Pitch display trim** for the slider, step buttons, reset and close controls.
The saved range is -30 to +30 degrees in 0.5-degree steps.

Positive trim adds nose-up pitch to the displayed estimate and moves the horizon
down. Trim is not a replacement for mounting calibration and does not correct
gyro bias or the slip indication.

**The current trim also affects pitch sent to XCSoar.** Raw recorded attitude
remains untrimmed. Closing the panel does not undo a trim change; use its reset
control to return to zero.

### Angle Number Size

Open **Angle number size** to adjust the bank/pitch scale labels. The saved range
is 10-24, with a default of 14. This does not change every text size in the app.

### Optional Display Elements

Open **Display elements** to enable the altitude tape, GPS ground-speed tape,
reference ground grid, turn indicator and turn-and-slip page. Source, unit, QNH
and visibility selections are saved.
Use **Help** for offline explanations; **Back** returns to the settings.

The reference grid follows estimated pitch, bank and relative gyro turn. Its
scale is fixed: it does not use GPS position or altitude and does not represent
terrain. It disappears when the live attitude/turn reference is unavailable.

## Altitude, QNH and Flight Level

### Choosing an Altitude Source

1. Open **Display elements** and enable **Altitude tape**.
2. Select **Barometric** or **GPS**.
3. Choose metres (`m`) or feet (`ft`).

The right tape is headed **Alt**, with the selected unit beneath it. The source
label appears at the bottom. The app does not silently switch sources if the
selected one fails.

### Barometric Altitude and QNH

Barometric altitude uses the phone's pressure sensor and your QNH setting. A
phone without a barometer cannot provide this reading.

To set an altitude reference on the ground:

1. Select barometric altitude and wait for pressure data.
2. Tap the pointed current-altitude box, or choose **Adjust altitude / QNH** in
   Display elements.
3. Use a known field elevation. Higher wheel values appear above the selection
   and lower values below; drag downward to bring a higher value into the centre.
4. Alternatively, adjust QNH with the pressure step buttons. Pressure units can
   be selected as hPa or inHg in Display elements.
5. Select **Apply** to save, or **Cancel** to discard the preview.

The editor uses pressure captured when it opened. Reopen it if you need a new
pressure reference. The standard-pressure reset control selects **1013.25 hPa**;
it does not obtain local QNH. Supported QNH is 850-1100 hPa.

QNH changes barometric altitude only, not GPS altitude or the flight-level box.
Neither a correct-looking field elevation nor a QNH adjustment establishes
independent altitude accuracy.

### GPS Altitude

Enable device location and allow precise-location access when requested.

- **GPS MSL** means Android supplied mean-sea-level altitude.
- **GPS WGS84** means height above the WGS84 ellipsoid. This is a different datum
  and can differ significantly from mean-sea-level elevation.
- **GPS TEST** identifies mock GPS data if supplied by Android.

GPS altitude is read-only in the tape; tapping it does not adjust QNH. Poor
reception, missing permission, stale data or rejected accuracy can produce `---`.

### Flight Level

Enable **Flight level** under **Altitude tape** to show a box directly below
the Alt/unit header. This option is saved and defaults off.

Flight level uses fresh barometer pressure at standard **1013.25 hPa**, expressed
in hundreds of feet and rounded to the nearest whole level. For example,
`FL 035` represents 3,500 feet of pressure altitude.

The calculation is independent of selected altitude units, QNH and GPS altitude.
It still needs a barometer when the main altitude tape is set to GPS. There is no
GPS fallback. Missing or stale pressure shows `FL ---`; negative pressure altitude
can produce a negative indication such as `FL -005`.

This box is an experimental pressure-altitude indication, not a clearance,
assigned level or ground-clearance measurement. It does not decide when to use
QNH versus standard pressure under local operating rules.

Pressure/GPS display readings expire after five seconds and have additional
quality checks. These optional readings are currently neither recorded nor sent
to XCSoar.

## GPS Speed and Reference Markings

Enable **GPS ground speed** in **Display elements**, then select `km/h`, `kt`
(knots) or `mph`. The left tape is headed **Speed**; the bottom label identifies
the source as **GS GPS** or mock **GS TEST**.

**This is ground speed, not airspeed.** A genuine measured zero is displayed as
zero; missing or rejected data is shown as `---`, not substituted with zero.

### Setting Reference Speeds

1. With the GPS speed option enabled, find **Speed references**.
2. Enter **Approach speed**, **Va** and **Vne** in the selected speed unit.
3. Check the entries, then select **Save speed references**.

Values must satisfy `0 < approach < Va < Vne`, with a maximum equivalent to
400 m/s. This is the app's input rule, not a recommendation of aircraft speeds.
Consult the aircraft's documentation rather than inventing limits.

Saved references survive unit changes. **Clear** removes them. No defaults are
assumed. In older versions, Approach speed was called Best landing speed; the
rename preserves the stored value.

| Marking | Configured reference |
| --- | --- |
| Yellow triangle | Approach speed |
| Green strip | Below Va |
| Amber strip | Va to Vne |
| Red line and red strip above it | Vne and above |

These markings are drawn against GPS ground speed. Wind makes them unsuitable
for deciding whether aircraft airspeed is safe. Va is not necessarily the certified
green/amber boundary on an aircraft airspeed indicator. The app does not infer
stall speeds, flap operating ranges or a safe approach from these settings.

## Correction Gain

Open **Correction gain** for the compact slider and step controls. The saved
range is **0.00-1.00**, in steps of **0.01**. The default and Reset value are
**0.10**. Updating the app does not replace an existing saved gain; use Reset
to select the new default.

The control changes accelerometer correction of the attitude estimate, not just
display smoothing:

- Lower gain reduces accelerometer influence but increases reliance on the gyro,
  drift risk and time needed to correct an attitude error.
- Higher gain increases accelerometer influence, including susceptibility to
  interpreting vehicle acceleration as tilt.
- Zero disables accelerometer correction after startup. Startup and estimator
  restarts still use accelerometer alignment.

Changes apply live without resetting the current attitude. **Applied** reports
the service's setting; a non-default gain is indicated beside the heading
reference. Closing the panel does not cancel a change. The setting survives
app restarts and also affects attitude sent through an enabled XCSoar feed.

Use controlled ground tests and recordings to compare settings. None of these
values solves the ambiguity between gravity and sustained acceleration. There
is no recommended flight setting or validated accuracy bound.

### Gyro Low-Pass (Experimental)

Open **Gyro low-pass** from the menu. It defaults to **Off**. Turning it on selects
**10 Hz**; use the slider or arrow buttons to choose **5-30 Hz in 1 Hz steps**.
The setting applies live and is saved for the next launch. Closing the panel
does not cancel changes. **Applied** shows the service setting; **GYRO LPF** appears
on both instrument views while enabled. Turn the switch off to restore bypass.

This filters the gyro before attitude estimation, so it affects the horizon and
attitude sent to XCSoar, not just needle movement. Lower cutoff means stronger
high-frequency suppression and more lag. The accelerometer remains unfiltered;
the resulting timing difference needs evaluation. It cannot repair vibration
aliasing or sensor clipping. A cutoff at or above half the delivered sample rate
makes attitude unavailable rather than silently disabling the filter.

Use this only for controlled ground/replay experiments. No cutoff is validated
for flight. Compare raw sensor recordings, attitude drift and response to actual
rotation, not merely visual smoothness. Raw sensor and calibration data remain
unfiltered; recordings include the cutoff and timestamped changes.

## Connecting to XCSoar

GlideHorizon supplies an optional bank/pitch feed using the GDL90 ForeFlight AHRS
extension. Only one selected destination is active at a time.

Before setting up a connection:

1. Accept a ground calibration and confirm the phone orientation.
2. Turn transmission off before changing connection mode or destination.
3. In XCSoar, use an unused device slot and leave unrelated sensor connections
   unchanged.

XCSoar menu names vary by version and language. **Config > Devices** may appear
as **Config > Instrument**. The selected driver must support **GDL90**.

### Local: Both Apps on One Device

1. In XCSoar, edit an unused device slot.
2. Select **UDP listener** or **UDP-port**, and driver **GDL90**.
3. Choose a UDP port, for example **4000**, and save.
4. In GlideHorizon, open **XCSoar feed**, select **Local** and enter the same port.
5. Enable **Transmit live attitude**.
6. Return to XCSoar and check its device status for the connection and
   **ForeFlight AHRS** data.

The local connection uses `127.0.0.1`; it does not require a Wi-Fi connection.
The default port is 4000, but matching the receiver's configured port is what
matters. Some XCSoar versions label the numeric field TCP-port even when the
selected connection type is UDP.

### Wi-Fi: Another Device

1. Connect both devices to the same trusted Wi-Fi network, or connect the
   receiving device to the sensor phone's hotspot.
2. On the receiving device, configure XCSoar as a UDP listener using GDL90 and
   your chosen port.
3. Find the receiving device's IPv4 address in its Wi-Fi settings.
4. In GlideHorizon, select **Wi-Fi**, enter that receiver address and matching port,
   then enable **Transmit live attitude**.
5. Verify reception and bank/pitch response in XCSoar.

Use the receiver's address, not the sensor phone's address. Supported addresses
are private IPv4 addresses in `10.x.x.x`, `172.16.x.x` through `172.31.x.x`, or
`192.168.x.x`, with a final number from 1 to 254. Hostnames, IPv6, broadcast and
multicast destinations are not supported by this control.

Guest-network isolation, VPNs, firewalls and changed receiver addresses can
prevent delivery. The app does not configure those network settings. LAN UDP is
not encrypted or authenticated; use a trusted network.

### Bluetooth: Another Android Device

1. Turn Bluetooth on for both devices.
2. In GlideHorizon, select **Bluetooth** and grant **Allow Bluetooth** / Nearby
   devices permission when requested.
3. Select **Pair receiver**. The sensor phone requests 120 seconds of discoverability.
4. From the receiving device's Android Bluetooth settings, pair with the sensor
   phone and confirm matching pairing prompts on both devices. Contacts and
   call-history sharing are not required.
5. Back in GlideHorizon, select **Refresh paired** and choose the Android device
   running XCSoar, not a headset, car or unrelated accessory.
6. Enable transmission.
7. In XCSoar, choose the paired sensor phone as the Bluetooth port and select
   driver **GDL90**. Save and check reception; use Reconnect if necessary.

This connection uses Bluetooth Classic SPP, not BLE. GlideHorizon is the server
and XCSoar is the client; do not select Bluetooth-server on the receiving XCSoar.
No UDP port or baud-rate setting is needed for this mode.

### What Is Sent and Remembered

Only bank and pitch are supplied. Current pitch trim and correction-gain effects
are reflected in that estimate. Heading, airspeed, GPS position, altitude and
flight level are not supplied by this feed.

Transmission requires fresh usable attitude and an accepted calibration. Held,
stale, initializing, invalid or uncalibrated attitude is withheld. A degraded
estimate may still be transmitted, and the AHRS message cannot carry all of the
quality information shown in GlideHorizon.

**SENDING means submission, not confirmed reception.** Check XCSoar itself.
Stopping packets may not immediately clear its displayed attitude; the receiver
can retain old values or use another source. Do not assume a safe automatic
fallback or independent redundancy.

The selected connection, destination, port and enabled setting are remembered.
Quit or Stop horizon stops runtime transmission without clearing the enabled
preference; reopening waits for eligible fresh attitude before sending again.
Explicitly disabling transmission, using **Stop XCSoar feed**, or opening
calibration turns the saved feed setting off.

The **Help** button in XCSoar feed provides offline instructions for the selected
mode. **Back** returns to the form without discarding its unfinished entries.

## Background Operation and Notifications

Opening GlideHorizon starts an Android foreground service. It can continue
processing while XCSoar or another app is visible. Despite the name, a foreground
service does not mean GlideHorizon must remain the app on screen.

While running, it posts **GlideHorizon is running**:

- Tap the notice to return to the app.
- Use **Stop horizon** to stop processing and transmission.
- When available, **Stop XCSoar feed** stops transmission while leaving the
  horizon service running and remembers the feed as disabled.

Android 13 and later request notification permission once independently of the
feed. If you decline, open Android **Settings > Apps > GlideHorizon > Notifications**
to allow notifications or change channel settings. Names vary by phone; there is
no separate running-notification item in GlideHorizon's menu.

Android controls notification visibility. Denial can hide the notice from the
shade while the service still runs and appears under active apps. Silent-icon
settings and full-screen apps can also hide status-bar icons. The notice is not
an always-visible overlay or a repeated pop-up alert.

### Permissions and Power Management

| Permission or setting | Purpose |
| --- | --- |
| Notifications on Android 13+ | Allows the running notice to be displayed |
| Precise location | Optional GPS altitude and ground speed |
| Nearby devices on newer Android versions | Optional Bluetooth connection and pairing workflow |
| Foreground-service permissions | Already declared by the app; no separate ordinary user grant |
| Manufacturer background/battery settings | May be needed if the phone stops the service |

No developer mode, USB debugging or overlay permission is required for normal
background use. The app does not request background-location permission.

GPS can remain active while the service runs behind another app if a GPS display
is enabled. Turn off GPS ground speed and GPS altitude to stop those GPS requests,
or stop the horizon service entirely. Flight level requires pressure, not GPS.

Some phones may need **Allow background activity** or **Unrestricted** battery
use in Android app settings. Names vary by manufacturer. These settings can
increase battery consumption and do not guarantee uninterrupted screen-off
operation. Test your intended phone, mounting and power arrangement.

The service does not automatically start at device boot. If Android kills the
process, it does not automatically resume the interrupted recording. Opening
the app again starts processing with its saved settings.

## Recording and Diagnostics

### Recording a Test

1. Open **Diagnostics** from the menu and select **Start recording** at the top.
2. Perform the planned controlled test. Note the mounting, reference conditions,
   motion and settings so the result can be interpreted later.
3. Select **Stop recording** in **Diagnostics** when finished. You can close and
   reopen Diagnostics without stopping an active recording.
4. Open **Recordings** to export through Android's document picker or delete a
   file after confirmation.

Recording is separate from simply running the horizon. Stop recording before
calibration. Quit and Stop horizon allow an active recording to finish writing
as the service shuts down; interrupted processes or storage failures may still
leave incomplete data.

Recordings contain sensor and diagnostic information, estimated attitude,
calibration/orientation metadata, display trim, magnetic-reference information
and correction gain/gyro low-pass changes. Raw recorded pitch is untrimmed. Current recordings
use schema 8; the decoder also accepts older schemas 1-7 with the gyro filter Off. Replay is not currently
implemented as a user feature.

The optional GPS/pressure tape readings and flight-level values are not currently
recorded. Do not assume a capture contains them because they were visible.

Files remain app-private until explicitly exported. After export, the destination
you chose controls access to that copy. Review recordings before sharing them:
device and mounting metadata may identify your setup.

Storage and queue limits can stop recording or cause dropped records. A recording
is not necessarily complete merely because a file exists. Check available status
and integrity information before using it for analysis. Recording failures do not
necessarily stop sensor acquisition.

### Diagnostics

Use **Diagnostics** to inspect the available sensors, samples, timing, faults and
attitude information. Requested sample rate is not proof of the actual delivered
rate. Android sensor accuracy flags are not attitude error bounds in degrees.

Raw sensor vectors use the phone's native axes unless explicitly shown as
body-frame values. Do not confuse a raw device axis with an aircraft axis before
accounting for mounting calibration. The displayed force magnitude is specific
force, not a validated aircraft load-factor instrument.

## Troubleshooting

| Symptom | Checks and limitations |
| --- | --- |
| Pitch changes during acceleration or roll changes in a turn | This can be a gravity/acceleration ambiguity, not a faulty sensor. Gain changes trade this error against drift; they do not make the estimate dependable in sustained manoeuvres. |
| Horizon does not match a known stationary pose | Check orientation, physical mounting, accepted calibration, known ground pitch and nonzero display trim. Do not recalibrate against an unknown pose. |
| Wing-tilt calibration reports cross-axis motion | Read the measured fit and moving-sample counts. Avoid twisting, lifting or repositioning supports between captures; use one fixed fore-aft pivot. Flat mounting alone is not a reason to reject wing-tilt calibration. |
| Attitude becomes unavailable with gyro low-pass enabled | Inspect the exact reason in Diagnostics. The cutoff must be below half the delivered sample rate. Return the filter to Off for comparison during ground testing; do not hide sensor faults by changing filter settings. |
| Heading stays relative | Check magnetometer availability, surrounding interference and whether attitude is usable. Relative turn is not north. |
| Compass takes time to acquire a heading or rarely corrects magnetically | Check Heading reference, Magnetic field, Magnetic sample heading and Last magnetic correction in Diagnostics. Initial alignment needs fresh usable attitude and a horizontal turn reference, RUNNING estimator status, suitable sensor accuracy, 20-70 uT total field, at least 5 uT horizontal field and rotation at most 20 deg/s. Later corrections require two seconds of agreement; readings repeatedly crossing the field limit restart that check. Try a stationary position away from magnetic cases, holders, chargers and metal. Another compass displaying a value does not establish accuracy. |
| Swiping does not open the turn-and-slip page | Enable **Turn and slip page** in Display elements, close any menu or settings panel, then swipe left across the horizon. **Turn indicator** alone enables only the overlay. |
| Turn needle is unavailable | Check attitude freshness and gyro-rate availability. Held/invalid attitude or near-vertical pitch makes heading turn rate unavailable, even if the slip ball still has usable data. |
| Turn needle moves beyond its outer mark | The needle continues beyond the configured outer tick to a horizontal stop at twice that rate. The unmarked extension gives an over-range indication; rates beyond the stop cannot be distinguished. |
| ATTITUDE HELD remains visible | It is old data retained during low-force/reacquisition conditions. Do not interpret it as current attitude. |
| Altitude or flight level shows dashes | Check the selected source, barometer availability, fresh pressure, GPS permission/reception and data-quality status. FL always needs pressure. |
| Flight level differs from the altitude tape | Expected when QNH differs from standard pressure, when units differ, or when the main tape uses GPS. FL is standard-pressure altitude in hundreds of feet. |
| Negative FL on the ground | Standard-pressure altitude can be negative when ambient pressure exceeds standard sea-level pressure. It is not a ground-clearance value. |
| GPS altitude differs from a surveyed elevation | Check whether the source is MSL or WGS84, reception quality and the limitations of phone altitude. QNH cannot adjust GPS altitude. |
| Speed colours do not match aircraft airspeed | They are references on GPS ground speed. Wind and different speed definitions prevent treating them as aircraft airspeed limits. |
| XCSoar receives nothing | Check accepted calibration, fresh attitude, enabled transmission, selected destination, matching UDP ports or Bluetooth pairing, and the GDL90 driver. Use the mode-specific Help page. |
| Wi-Fi worked previously but stopped | Recheck the receiver's address, network isolation, firewall and VPN settings. DHCP can change addresses. |
| Bluetooth waits for a receiver | XCSoar must connect as the client to the sensor phone. Check the selected paired device, permissions and driver; reconnect if needed. |
| No running notification | Check Android Settings > Apps > GlideHorizon > Notifications. Silent notifications may be lower in the shade; full-screen apps can hide the status bar. |
| Processing stops in the background | Check battery/background restrictions and whether the service was stopped. Foreground operation does not guarantee continuous delivery on every phone. |
| An APK update is rejected | Check signing compatibility and release instructions. Do not uninstall without considering the loss of private recordings, calibration and settings. |
| A setting returns after reopening | Most changes, including Correction gain and Gyro low-pass, are saved immediately; closing those panels is not an undo operation. QNH and Turn scale use explicit Apply/Cancel, and cancelling discards their previews. |

For a useful problem report, include app version, phone model, Android version,
reproduction steps, connection mode if relevant, and the exact visible status.
Use the support channel published with your release. Remove unrelated personal
notifications and private information from screenshots or exported data.

## Menu Reference

| Menu item | Purpose |
| --- | --- |
| Display orientation | Select portrait, landscape or inverted orientation |
| Pitch display trim | Apply a saved pitch offset, also reflected in XCSoar output |
| Angle number size | Resize bank/pitch scale labels |
| Display elements | Configure altitude, flight level, GPS speed, reference speeds, units, grid and turn-indicator views |
| Correction gain | Adjust saved live accelerometer correction strength |
| Gyro low-pass | Enable experimental pre-Fusion gyro filtering and choose a 5-30 Hz cutoff |
| XCSoar feed | Configure and enable the selected attitude connection |
| Ground calibration | Establish the stationary mounting reference or measured wing axis |
| Recordings | Export or delete saved captures |
| Diagnostics | Start/stop local test recording and inspect sensor/estimator information |
| About / licenses | View application information and license notices |
| Donate | Open the owner's Ko-fi page in a browser |
| Quit | Stop processing/transmission, close the app and remove it from Recents |

Some specially built development versions include **Test inputs**. This is absent
from normal builds. If present, its synthetic display is labelled and is not a
live sensor measurement; entering it disables transmission. Use **Exit test mode**
inside that dialog to return to live attitude.

## Licenses and Donations

Read **About / licenses** and the terms supplied with your release. GlideHorizon
also provides its [privacy policy](https://humlan25.github.io/glidehorizon-site/privacy.html)
and support contact, [ubackudd@gmail.com](mailto:ubackudd@gmail.com), from that screen.

GlideHorizon
is proprietary; free availability does not make its original source open source.
Third-party components retain their own licenses. Experimental evaluation builds
may have restricted distribution/use terms.

**Donate** opens [Ulf Backudd's Ko-fi page](https://ko-fi.com/ulfbackudd) in your
browser. Contributions are optional and handled by Ko-fi, not by an in-app payment
processor. A donation does not change the app's measurement capabilities or safety
limitations. Review Ko-fi's terms and privacy information before contributing.