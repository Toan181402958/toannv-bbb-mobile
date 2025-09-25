import {
  AudioPresets,
  Track,
  ConnectionState,
  RoomEvent,
  ParticipantEvent,
} from 'livekit-client';
import { liveKitRoom } from '../livekit';
import MediaStreamUtils from './media-stream-utils';

const BRIDGE_NAME = 'livekit';
const SENDRECV_ROLE = 'sendrecv';
const ROOM_CONNECTION_TIMEOUT = 15000;

const LiveKitAudioBridge = class {
  constructor({ userId, logger, clientSessionNumber }) {
    this.role = SENDRECV_ROLE;
    this.bridgeName = BRIDGE_NAME;
    this.logger = logger;
    this.userId = userId;
    this.clientSessionNumber = clientSessionNumber;
    this.originalStream = null;
    this.liveKitRoom = liveKitRoom;
    this._inputDeviceId = null;

    this.onended = this.onended.bind(this);
    this.handleTrackSubscribed = this.handleTrackSubscribed.bind(this);
    this.handleTrackUnsubscribed = this.handleTrackUnsubscribed.bind(this);
    this.handleTrackSubscriptionFailed =
      this.handleTrackSubscriptionFailed.bind(this);
    this.handleLocalTrackMuted = this.handleLocalTrackMuted.bind(this);
    this.handleLocalTrackUnmuted = this.handleLocalTrackUnmuted.bind(this);
    this.handleLocalTrackPublished = this.handleLocalTrackPublished.bind(this);
    this.handleLocalTrackUnpublished =
      this.handleLocalTrackUnpublished.bind(this);

    this.observeLiveKitEvents();
  }

  set inputDeviceId(deviceId) {
    this._inputDeviceId = deviceId;
  }

  get inputDeviceId() {
    return this._inputDeviceId;
  }

  get inputStream() {
    const micTrackPublications = this.getLocalMicTrackPubs();
    const publication = micTrackPublications[0];
    return this.originalStream || publication?.track?.mediaStream || null;
  }

  getLocalMicTrackPubs() {
    return Array.from(
      this.liveKitRoom.localParticipant.audioTrackPublications.values()
    ).filter((pub) => pub.source === Track.Source.Microphone);
  }

  onstart() {
    this.logger.debug(
      {
        logCode: 'livekit_audio_started',
        extraInfo: { bridgeName: this.bridgeName, role: this.role },
      },
      'LiveKit: audio started'
    );
  }

  onended() {
    this.logger.debug(
      {
        logCode: 'livekit_audio_ended',
        extraInfo: { bridgeName: this.bridgeName, role: this.role },
      },
      'LiveKit: audio ended'
    );
  }

  onpublished() {
    this.logger.debug(
      {
        logCode: 'livekit_audio_published',
        extraInfo: { bridgeName: this.bridgeName, role: this.role },
      },
      'LiveKit: audio published'
    );
  }

  static isMicrophonePublication(publication) {
    return publication.source === Track.Source.Microphone;
  }

  static isMicrophoneTrack(track) {
    if (!track) return false;
    return track.source === Track.Source.Microphone;
  }

  handleTrackSubscribed(track, publication) {
    if (!LiveKitAudioBridge.isMicrophonePublication(publication)) return;

    const { trackSid, trackName } = publication;
    this.logger.debug(
      {
        logCode: 'livekit_audio_subscribed',
        extraInfo: {
          bridgeName: this.bridgeName,
          trackSid,
          trackName,
          role: this.role,
        },
      },
      `LiveKit: subscribed to microphone - ${trackSid}`
    );
  }

  handleTrackUnsubscribed(track, publication) {
    if (!LiveKitAudioBridge.isMicrophoneTrack(track)) return;

    const { trackSid, trackName } = publication;
    this.logger.debug(
      {
        logCode: 'livekit_audio_unsubscribed',
        extraInfo: {
          bridgeName: this.bridgeName,
          trackSid,
          trackName,
          role: this.role,
        },
      },
      `LiveKit: unsubscribed from microphone - ${trackSid}`
    );
  }

  handleTrackSubscriptionFailed(trackSid) {
    this.logger.error(
      {
        logCode: 'livekit_audio_subscription_failed',
        extraInfo: { bridgeName: this.bridgeName, trackSid, role: this.role },
      },
      `LiveKit: failed to subscribe to microphone - ${trackSid}`
    );
  }

  handleLocalTrackMuted(publication) {
    if (!LiveKitAudioBridge.isMicrophonePublication(publication)) return;

    const { trackSid, isMuted, trackName } = publication;
    this.logger.debug(
      {
        logCode: 'livekit_audio_track_muted',
        extraInfo: {
          bridgeName: this.bridgeName,
          role: this.role,
          trackSid,
          trackName,
          isMuted,
        },
      },
      `LiveKit: audio track muted - ${trackSid}`
    );
  }

  handleLocalTrackUnmuted(publication) {
    if (!LiveKitAudioBridge.isMicrophonePublication(publication)) return;

    const { trackSid, isMuted, trackName } = publication;
    this.logger.debug(
      {
        logCode: 'livekit_audio_track_unmuted',
        extraInfo: {
          bridgeName: this.bridgeName,
          role: this.role,
          trackSid,
          trackName,
          isMuted,
        },
      },
      `LiveKit: audio track unmuted - ${trackSid}`
    );
  }

  handleLocalTrackPublished(publication) {
    if (!LiveKitAudioBridge.isMicrophonePublication(publication)) return;

    const { trackSid, trackName } = publication;
    this.logger.debug(
      {
        logCode: 'livekit_audio_published',
        extraInfo: {
          bridgeName: this.bridgeName,
          role: this.role,
          trackSid,
          trackName,
        },
      },
      `LiveKit: audio track published - ${trackSid}`
    );
  }

  handleLocalTrackUnpublished(publication) {
    if (!LiveKitAudioBridge.isMicrophonePublication(publication)) return;

    const { trackSid, trackName } = publication;
    this.logger.debug(
      {
        logCode: 'livekit_audio_unpublished',
        extraInfo: {
          bridgeName: this.bridgeName,
          role: this.role,
          trackSid,
          trackName,
        },
      },
      `LiveKit: audio track unpublished - ${trackSid}`
    );
  }

  observeLiveKitEvents() {
    if (!this.liveKitRoom) return;

    this.removeLiveKitObservers();
    this.liveKitRoom.on(RoomEvent.TrackSubscribed, this.handleTrackSubscribed);
    this.liveKitRoom.on(
      RoomEvent.TrackUnsubscribed,
      this.handleTrackUnsubscribed
    );
    this.liveKitRoom.on(
      RoomEvent.TrackSubscriptionFailed,
      this.handleTrackSubscriptionFailed
    );
    this.liveKitRoom.localParticipant.on(
      ParticipantEvent.TrackMuted,
      this.handleLocalTrackMuted
    );
    this.liveKitRoom.localParticipant.on(
      ParticipantEvent.TrackUnmuted,
      this.handleLocalTrackUnmuted
    );
    this.liveKitRoom.localParticipant.on(
      ParticipantEvent.LocalTrackPublished,
      this.handleLocalTrackPublished
    );
    this.liveKitRoom.localParticipant.on(
      ParticipantEvent.LocalTrackUnpublished,
      this.handleLocalTrackUnpublished
    );
  }

  removeLiveKitObservers() {
    if (!this.liveKitRoom) return;

    this.liveKitRoom.off(RoomEvent.TrackSubscribed, this.handleTrackSubscribed);
    this.liveKitRoom.off(
      RoomEvent.TrackUnsubscribed,
      this.handleTrackUnsubscribed
    );
    this.liveKitRoom.off(
      RoomEvent.TrackSubscriptionFailed,
      this.handleTrackSubscriptionFailed
    );
    this.liveKitRoom.localParticipant.off(
      ParticipantEvent.TrackMuted,
      this.handleLocalTrackMuted
    );
    this.liveKitRoom.localParticipant.off(
      ParticipantEvent.TrackUnmuted,
      this.handleLocalTrackUnmuted
    );
    this.liveKitRoom.localParticipant.off(
      ParticipantEvent.LocalTrackPublished,
      this.handleLocalTrackPublished
    );
    this.liveKitRoom.localParticipant.off(
      ParticipantEvent.LocalTrackUnpublished,
      this.handleLocalTrackUnpublished
    );
  }

  setSenderTrackEnabled(shouldEnable) {
    const trackPubs = this.getLocalMicTrackPubs();
    const handleMuteError = (error) => {
      this.logger.error(
        {
          logCode: 'livekit_audio_set_sender_track_error',
          extraInfo: {
            errorMessage: error.message,
            errorName: error.name,
            errorStack: error.stack,
            bridgeName: this.bridgeName,
            role: this.role,
            enabled: shouldEnable,
          },
        },
        `LiveKit: setSenderTrackEnabled failed - ${error.message}`
      );
    };

    if (shouldEnable) {
      const trackName = `${this.userId}-audio-${this.inputDeviceId ?? 'default'}`;
      const currentPubs = trackPubs.filter(
        (pub) => pub.trackName === trackName && pub.isMuted
      );

      if (currentPubs.length) {
        currentPubs.forEach((pub) => pub.unmute());
        this.logger.debug(
          {
            logCode: 'livekit_audio_track_unmute',
            extraInfo: {
              bridgeName: this.bridgeName,
              role: this.role,
              trackName,
            },
          },
          `LiveKit: unmuting audio track - ${trackName}`
        );
        return true;
      } else if (trackPubs.length === 0) {
        this.publish(this.originalStream).catch(handleMuteError);
        this.logger.debug(
          {
            logCode: 'livekit_audio_track_unmute_publish',
            extraInfo: {
              bridgeName: this.bridgeName,
              role: this.role,
              trackName,
            },
          },
          `LiveKit: audio track unmute+publish - ${trackName}`
        );
        return true;
      } else {
        this.logger.debug(
          {
            logCode: 'livekit_audio_track_unmute_noop',
            extraInfo: {
              bridgeName: this.bridgeName,
              role: this.role,
              trackName,
              trackPubs,
            },
          },
          'LiveKit: audio track unmute no-op'
        );
        return false;
      }
    } else {
      this.liveKitRoom.localParticipant
        .setMicrophoneEnabled(false)
        .catch(handleMuteError);
      return true;
    }
  }

  hasMicrophoneTrack() {
    return this.getLocalMicTrackPubs().length > 0;
  }

  async publish(inputStream) {
    try {
      const basePublishOptions = {
        audioPreset: AudioPresets.music,
        dtx: false,
        red: true,
        forceStereo: false,
      };
      const publishOptions = {
        ...basePublishOptions,
        source: Track.Source.Microphone,
        name: `${this.userId}-audio-${this.inputDeviceId ?? 'default'}`,
      };
      const constraints = {
        autoGainControl: true,
        echoCancellation: true,
        noiseSuppression: true,
      };

      if (this.hasMicrophoneTrack()) await this.unpublish();

      if (inputStream && !inputStream.active) {
        this.logger.warn(
          {
            logCode: 'livekit_audio_publish_inactive_stream',
            extraInfo: {
              bridgeName: this.bridgeName,
              role: this.role,
              inputDeviceId: this.inputDeviceId,
              streamData: MediaStreamUtils.getMediaStreamLogData(inputStream),
            },
          },
          'LiveKit: audio stream is inactive, fallback'
        );
      }

      if (inputStream && inputStream.active) {
        this.logger.debug(
          {
            logCode: 'livekit_audio_publish_with_stream',
            extraInfo: {
              bridgeName: this.bridgeName,
              role: this.role,
              inputDeviceId: this.inputDeviceId,
              streamData: MediaStreamUtils.getMediaStreamLogData(inputStream),
            },
          },
          'LiveKit: publishing audio track with stream'
        );
        const trackPublishers = inputStream
          .getTracks()
          .map((track) =>
            this.liveKitRoom.localParticipant.publishTrack(
              track,
              publishOptions
            )
          );
        await Promise.all(trackPublishers);
      } else {
        await this.liveKitRoom.localParticipant.setMicrophoneEnabled(
          true,
          constraints,
          publishOptions
        );
        this.originalStream = this.inputStream;
        this.logger.debug(
          {
            logCode: 'livekit_audio_publish_without_stream',
            extraInfo: {
              bridgeName: this.bridgeName,
              role: this.role,
              inputDeviceId: this.inputDeviceId,
              streamData: MediaStreamUtils.getMediaStreamLogData(
                this.originalStream
              ),
            },
          },
          'LiveKit: published audio track without stream'
        );
      }

      this.onpublished();
    } catch (error) {
      this.logger.error(
        {
          logCode: 'livekit_audio_publish_error',
          extraInfo: {
            errorMessage: error.message,
            errorName: error.name,
            errorStack: error.stack,
            bridgeName: this.bridgeName,
            role: this.role,
            inputDeviceId: this.inputDeviceId,
            streamData: MediaStreamUtils.getStreamData(
              inputStream || this.originalStream
            ),
          },
        },
        'LiveKit: failed to publish audio track'
      );
      throw error;
    }
  }

  unpublish() {
    const micTrackPublications = this.getLocalMicTrackPubs();
    if (!micTrackPublications || micTrackPublications.length === 0)
      return Promise.resolve();

    const unpublishers = micTrackPublications.map((pub) => {
      if (pub?.track && pub?.source === Track.Source.Microphone) {
        return this.liveKitRoom.localParticipant.unpublishTrack(pub.track);
      }
      return Promise.resolve();
    });

    return Promise.all(unpublishers).catch((error) => {
      this.logger.error(
        {
          logCode: 'livekit_audio_unpublish_error',
          extraInfo: {
            errorMessage: error.message,
            errorName: error.name,
            errorStack: error.stack,
            bridgeName: this.bridgeName,
            role: this.role,
          },
        },
        'LiveKit: failed to unpublish audio track'
      );
    });
  }

  waitForRoomConnection() {
    return new Promise((resolve, reject) => {
      if (this.liveKitRoom.state === ConnectionState.Connected) {
        resolve();
        return;
      }

      const timeout = setTimeout(() => {
        this.liveKitRoom.off(RoomEvent.Connected, onRoomConnected);
        reject(new Error('Room connection timeout'));
      }, ROOM_CONNECTION_TIMEOUT);

      const onRoomConnected = () => {
        clearTimeout(timeout);
        resolve();
      };

      this.liveKitRoom.once(RoomEvent.Connected, onRoomConnected);
    });
  }

  async joinAudio({ muted, inputStream }) {
    try {
      await this.waitForRoomConnection();
      this.originalStream = inputStream;

      if (!muted) await this.publish(inputStream);

      this.onstart();
    } catch (error) {
      this.logger.error(
        {
          logCode: 'livekit_audio_init_error',
          extraInfo: {
            errorMessage: error.message,
            errorName: error.name,
            errorStack: error.stack,
            bridgeName: this.bridgeName,
            role: this.role,
            inputDeviceId: this.inputDeviceId,
            streamData: MediaStreamUtils.getStreamData(
              inputStream || this.originalStream
            ),
          },
        },
        `LiveKit: activate audio failed: ${error.message}`
      );
      throw error;
    }
  }

  stop() {
    return this.liveKitRoom.localParticipant
      .setMicrophoneEnabled(false)
      .then(() => this.unpublish())
      .then(() => {
        this.logger.info(
          {
            logCode: 'livekit_audio_exit',
            extraInfo: { bridgeName: this.bridgeName, role: this.role },
          },
          'LiveKit: audio exited'
        );
        return true;
      })
      .catch((error) => {
        this.logger.error(
          {
            logCode: 'livekit_audio_exit_error',
            extraInfo: {
              errorMessage: error.message,
              errorName: error.name,
              errorStack: error.stack,
              bridgeName: this.bridgeName,
              role: this.role,
            },
          },
          'LiveKit: exit audio failed'
        );
        return false;
      })
      .finally(() => {
        this.removeLiveKitObservers();
        this.originalStream = null;
        this.onended();
      });
  }
};

export default LiveKitAudioBridge;
