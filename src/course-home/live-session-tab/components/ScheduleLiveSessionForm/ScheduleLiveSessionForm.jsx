import React, { useState, useEffect } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Button,
  Form,
  Spinner,
  Alert,
} from '@openedx/paragon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import messages from '../../messages';
import './ScheduleLiveSessionForm.scss';

const ScheduleLiveSessionForm = ({
  courseId,
  editingSession,
  onBack,
  scheduleLiveSession,
  updateLiveSession,
  label,
}) => {
  const { formatMessage } = useIntl();
  const isEdit = !!editingSession;

  const [configData, setConfigData] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(true);

  const [formData, setFormData] = useState({
    topic: '',
    description: '',
    scheduleDateTime: '',
    durationHour: '0',
    durationMinute: '0',
    timezone: 'Asia/Kolkata',
    isRecurring: false,
    recurrenceType: 'daily',
    repeatEvery: 1,
    weeklyDays: [],
    monthlyOption: 1,
    monthlyDay: 1,
    monthlyWeek: 'first',
    monthlyWeekday: 'monday',
    endDate: '',
    externalAttendees: '',
    alternativeHosts: '',
    muteOnEntry: true,
    keepVideo: false,
  });

  const [errors, setErrors] = useState({});
  const [availableAttendees, setAvailableAttendees] = useState([]);
  const [selectedAttendees, setSelectedAttendees] = useState([]);
  const [selectedAvailable, setSelectedAvailable] = useState([]);
  const [selectedSelectedSide, setSelectedSelectedSide] = useState([]);
  const [leftFilter, setLeftFilter] = useState('');
  const [rightFilter, setRightFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch schedule config
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await getAuthenticatedHttpClient().get(
          `${getConfig().LMS_BASE_URL}/api/v1/live-classes/schedule/?course_id=${courseId}`
        );
        setConfigData(res.data);
        setAvailableAttendees(res.data.internal_attendees?.map(att => att.email) || []);
      } catch (err) {
        console.error('Failed to fetch schedule config:', err);
      } finally {
        setLoadingConfig(false);
      }
    };
    fetchConfig();
  }, [courseId]);

  // Fetch edit data and prefill form
  useEffect(() => {
    const fetchEditData = async () => {
      if (!editingSession?.id) return;

      try {
        const res = await getAuthenticatedHttpClient().get(
          `${getConfig().LMS_BASE_URL}/api/v1/live-classes/update/${editingSession.id}/`
        );

        const data = res.data.meeting || res.data;

        let recurrenceType = 'daily';
        if (data.recurrence === 2) recurrenceType = 'weekly';
        if (data.recurrence === 3) recurrenceType = 'monthly';

        setFormData({
          topic: data.topic || '',
          description: data.agenda || '',
          scheduleDateTime: data.schedule_time || '',
          durationHour: data.duration_hours?.toString() || '0',
          durationMinute: data.duration_minutes?.toString() || '0',
          timezone: data.timezone || 'Asia/Kolkata',
          isRecurring: data.is_recurring || false,
          recurrenceType,
          repeatEvery: data.repeat_every?.toString() || '1',

          // Weekly Days
          weeklyDays: data.occurs_on_weekly
            ? data.occurs_on_weekly.map(d => {
                const dayMap = { 1: 'sunday', 2: 'monday', 3: 'tuesday', 4: 'wednesday', 5: 'thursday', 6: 'friday', 7: 'saturday' };
                return dayMap[parseInt(d)] || '';
              }).filter(Boolean)
            : [],

          // Monthly Fields
          monthlyOption: data.day_of_month ? 1 : 2,
          monthlyDay: data.day_of_month || 1,
          monthlyWeek: data.week_of_month || 'first',
          monthlyWeekday: data.week_day_of_month
            ? ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][data.week_day_of_month - 1]
            : 'monday',

          endDate: data.end_date || '',
          externalAttendees: Array.isArray(data.external_attendees) ? data.external_attendees.join(', ') : '',
          alternativeHosts: Array.isArray(data.alternative_hosts) ? data.alternative_hosts.join(', ') : '',
          muteOnEntry: data.mute_upon_entry === true || data.mute_upon_entry === 'on',
          keepVideo: data.participant_video === true || data.participant_video === 'on',
        });

        setSelectedAttendees(Array.isArray(data.internal_attendees) ? data.internal_attendees : []);
        setErrors({});
      } catch (err) {
        console.error('Failed to fetch edit data:', err);
      }
    };

    if (isEdit) fetchEditData();
  }, [editingSession, isEdit]);

  // Minimum datetime for scheduling
  const getMinDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const local = new Date(now.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
  };

  const [minDateTime, setMinDateTime] = useState(getMinDateTime());

  useEffect(() => {
    const interval = setInterval(() => setMinDateTime(getMinDateTime()), 60000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'scheduleDateTime' || name === 'endDate') {
      const selected = new Date(value);
      const now = new Date();

      if (selected < now) {
        setFormData(prev => ({
          ...prev,
          [name]: minDateTime,
        }));
        return;
      }
    }
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const toggleWeeklyDay = (day) => {
    setFormData(prev => ({
      ...prev,
      weeklyDays: prev.weeklyDays.includes(day)
        ? prev.weeklyDays.filter(d => d !== day)
        : [...prev.weeklyDays, day],
    }));
    if (errors.weeklyDays) setErrors(prev => ({ ...prev, weeklyDays: '' }));
  };

  // Attendee transfer handlers
  const toggleAvailableSelection = (email) => {
    setSelectedAvailable(prev =>
      prev.includes(email) ? prev.filter(item => item !== email) : [...prev, email]
    );
  };

  const toggleSelectedSelection = (email) => {
    setSelectedSelectedSide(prev =>
      prev.includes(email) ? prev.filter(item => item !== email) : [...prev, email]
    );
  };

  const handleMoveRight = () => {
    if (selectedAvailable.length === 0) return;
    const toMove = [...selectedAvailable];
    setSelectedAttendees(prev => [...new Set([...prev, ...toMove])]);
    setAvailableAttendees(prev => prev.filter(item => !toMove.includes(item)));
    setSelectedAvailable([]);
    setLeftFilter('');
  };

  const handleMoveLeft = () => {
    if (selectedSelectedSide.length === 0) return;
    const toMove = [...selectedSelectedSide];
    setAvailableAttendees(prev => [...new Set([...prev, ...toMove])]);
    setSelectedAttendees(prev => prev.filter(item => !toMove.includes(item)));
    setSelectedSelectedSide([]);
    setRightFilter('');
  };

  const handleChooseAll = () => {
    setSelectedAttendees(prev => [...new Set([...prev, ...availableAttendees])]);
    setAvailableAttendees([]);
    setSelectedAvailable([]);
    setLeftFilter('');
  };

  const handleRemoveAll = () => {
    setAvailableAttendees(prev => [...new Set([...prev, ...selectedAttendees])]);
    setSelectedAttendees([]);
    setSelectedSelectedSide([]);
    setRightFilter('');
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    if (name === 'durationHour' || name === 'durationMinute') {
      setFormData(prev => ({ ...prev, [name]: prev[name] || '0' }));
    }
  };

  // Form Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.topic?.trim()) {
      newErrors.topic = formatMessage(messages['scheduleLiveSession.validation.topicRequired']);
    }
    if (!formData.scheduleDateTime) {
      newErrors.scheduleDateTime = formatMessage(messages['scheduleLiveSession.validation.scheduleDateTimeRequired']);
    }
    if (!formData.timezone) {
      newErrors.timezone = formatMessage(messages['scheduleLiveSession.validation.timezoneRequired']);
    }

    const totalMinutes = parseInt(formData.durationHour || 0) * 60 + parseInt(formData.durationMinute || 0);
    if (totalMinutes < 1) {
      newErrors.duration = formatMessage(messages['scheduleLiveSession.validation.durationRequired']);
    }

    const maxHours = configData?.maximumMeetingDuration || 24;
    if (totalMinutes > maxHours * 60) {
      newErrors.duration = formatMessage(
        messages['scheduleLiveSession.validation.maxDuration'],
        { maxHours }
      );
    }

    const externalList = (formData.externalAttendees || '').split(',').map(e => e.trim()).filter(Boolean);
    if (selectedAttendees.length === 0 && externalList.length === 0) {
      newErrors.attendees = formatMessage(messages['scheduleLiveSession.validation.attendeesRequired']);
    }

    if (formData.isRecurring) {
      if (!formData.repeatEvery || parseInt(formData.repeatEvery) < 1) {
        newErrors.repeatEvery = formatMessage(messages['scheduleLiveSession.validation.repeatEveryRequired']);
      }
      if (!formData.endDate) {
        newErrors.endDate = formatMessage(messages['scheduleLiveSession.validation.endDateRequired']);
      }
      if (formData.recurrenceType === 'weekly' && formData.weeklyDays.length === 0) {
        newErrors.weeklyDays = formatMessage(messages['scheduleLiveSession.validation.weeklyDaysRequired']);
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError('');
    setSuccess(false);

    const internalAttendeesArray = [...selectedAttendees];
    const externalAttendeesArray = (formData.externalAttendees || '').split(',').map(e => e.trim()).filter(Boolean);
    const alternativeHostsArray = (formData.alternativeHosts || '').split(',').map(e => e.trim()).filter(Boolean);

    const payload = {
      course_id: courseId,
      topic: formData.topic,
      agenda: formData.description || '',
      schedule_time: formData.scheduleDateTime,
      duration_hours: parseInt(formData.durationHour) || 0,
      duration_min: parseInt(formData.durationMinute) || 0,
      time_zone: formData.timezone,
      is_recurring: formData.isRecurring,
      internal_attendees: internalAttendeesArray,
      external_attendees: externalAttendeesArray,
      alternative_hosts: alternativeHostsArray,
      mute_upon_entry: formData.muteOnEntry ? 'on' : 'off',
      participant_video: formData.keepVideo ? 'on' : 'off',
    };

    if (formData.isRecurring) {
      const recMap = { daily: 1, weekly: 2, monthly: 3 };
      payload.recurrence = recMap[formData.recurrenceType] || 1;
      payload.repeat_every = parseInt(formData.repeatEvery);
      payload.end_date = formData.endDate;
      payload.occurs_on_monthly = 'days';
      payload.day_of_month = parseInt(formData.monthlyDay);

      const weekMap = { first: 1, second: 2, third: 3, fourth: 4, last: -1 };
      payload.week_of_month = weekMap[formData.monthlyWeek] || 1;

      const dayMap = { sunday: 1, monday: 2, tuesday: 3, wednesday: 4, thursday: 5, friday: 6, saturday: 7 };
      payload.week_day_of_month = dayMap[formData.monthlyWeekday] || 1;

      if (formData.recurrenceType === 'weekly') {
        payload.occurs_on_weekly = formData.weeklyDays.map(day => dayMap[day]);
      }
    }

    try {
      let result;
      if (isEdit) {
        result = await updateLiveSession(editingSession.id, payload);
      } else {
        result = await scheduleLiveSession(payload);
      }

      if (result.success) {
        setSuccess(true);
        setSuccessMessage(
          isEdit
            ? formatMessage(messages['scheduleLiveSession.success.updated'])
            : formatMessage(messages['scheduleLiveSession.success.scheduled'])
        );
      } else {
        setApiError(result.error || formatMessage(messages['scheduleLiveSession.error.default']));
      }
    } catch (err) {
      setApiError(err.response?.data?.error ||
        err.response?.data?.message ||
        err.message || formatMessage(messages['scheduleLiveSession.error.default']));
    } finally {
      setLoading(false);
    }
  };

  const filteredAvailable = availableAttendees.filter(a =>
    !leftFilter || a.toLowerCase().includes(leftFilter.toLowerCase())
  );

  const filteredSelected = selectedAttendees.filter(a =>
    !rightFilter || a.toLowerCase().includes(rightFilter.toLowerCase())
  );

  if (loadingConfig) {
    return (
      <div className="d-flex justify-content-center py-8">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="schedule-live-session-form mb-5">
      <div className="container">
        <Button variant="link" onClick={onBack} className="mb-4 p-0 text-muted back-button">
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          {formatMessage(messages['scheduleLiveSession.back'])}
        </Button>

        <h2 className="mb-4 schedule-title">
          {isEdit
            ? formatMessage(messages['scheduleLiveSession.editTitle'])
            : formatMessage(messages['scheduleLiveSession.title'])
          }
           { label }
        </h2>

        {success && (
          <div className="d-flex flex-column justify-content-center align-items-center py-5">
            <h3 className="font-weight-bold text-center mb-4">{successMessage}</h3>
            <Button variant="primary" className="text-white" onClick={onBack}>
              {formatMessage(messages['scheduleLiveSession.popup.ok'])}
            </Button>
          </div>
        )}

        {apiError && <Alert variant="danger" className="mb-4">{apiError}</Alert>}

        {!success && (
          <div className="form-card">
            <Form onSubmit={handleSubmit}>
              {/* Topic */}
              <Form.Group className="mb-4">
                <Form.Label>
                  {formatMessage(messages['scheduleLiveSession.topic'])} <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                />
                {errors.topic && <Form.Text className="text-danger">{errors.topic}</Form.Text>}
              </Form.Group>

              {/* Description */}
              <Form.Group className="mb-4">
                <Form.Label>{formatMessage(messages['scheduleLiveSession.description'])}</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </Form.Group>

              {/* Schedule Date & Time */}
              <Form.Group className="mb-4">
                <Form.Label>
                  {formatMessage(messages['scheduleLiveSession.scheduleDateTime'])} <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="scheduleDateTime"
                  value={formData.scheduleDateTime}
                  onChange={handleChange}
                  min={minDateTime}
                />
                {errors.scheduleDateTime && <Form.Text className="text-danger">{errors.scheduleDateTime}</Form.Text>}
              </Form.Group>

              {/* Duration + Timezone */}
              <div className="d-flex mb-4 duration-time-container">
                <div className="w-50 durationHour">
                  <Form.Label className="mb-2">
                    {formatMessage(messages['scheduleLiveSession.duration'])} <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="duration-wrapper">
                    <Form.Control
                      type="number"
                      name="durationHour"
                      value={formData.durationHour}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      min="0"
                      max="23"
                    />
                    <span className="duration-label duration-label-hour ml-1">
                      {formatMessage(messages['scheduleLiveSession.hours'])}
                    </span>
                    <Form.Control
                      type="number"
                      name="durationMinute"
                      value={formData.durationMinute}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      min="0"
                      max="59"
                    />
                    <span className="duration-label mr-2 ml-1">
                      {formatMessage(messages['scheduleLiveSession.minutes'])}
                    </span>
                  </div>
                  {errors.duration && <Form.Text className="text-danger">{errors.duration}</Form.Text>}
                </div>

                <div className="w-50">
                  <Form.Label className="mb-2">
                    {formatMessage(messages['scheduleLiveSession.timezone'])} <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="select"
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleChange}
                  >
                    {configData?.timezones?.map((tz) => (
                      <option key={tz.value} value={tz.value}>
                        {tz.label}
                      </option>
                    ))}
                  </Form.Control>
                </div>
              </div>

              {/* Is Recurring Checkbox */}
              <Form.Group className="mb-4">
                <Form.Check
                  type="checkbox"
                  label={formatMessage(messages['scheduleLiveSession.isRecurring'])}
                  name="isRecurring"
                  checked={formData.isRecurring}
                  onChange={handleChange}
                  className="recurring-check"
                  disabled={isEdit && editingSession?.editAllRecurring === false}
                />
              </Form.Group>

              {/* Recurring Section */}
              {formData.isRecurring && (
                <div className="recurring-section">
                  <h5 className="recurring-title">
                    {formatMessage(messages['scheduleLiveSession.recurrenceSettings'])}
                  </h5>

                  <div className="mb-4 d-flex recurring-type-repeat-container">
                    <Form.Group className="w-50">
                      <Form.Label>{formatMessage(messages['scheduleLiveSession.recurrenceType'])}</Form.Label>
                      <Form.Control
                        as="select"
                        name="recurrenceType"
                        value={formData.recurrenceType}
                        onChange={handleChange}
                        disabled={isEdit && editingSession?.editAllRecurring === false}
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </Form.Control>
                    </Form.Group>

                    <Form.Group className="w-50">
                      <Form.Label>{formatMessage(messages['scheduleLiveSession.repeatEvery'])}</Form.Label>
                      <div className="repeat-every-wrapper">
                        <Form.Control
                          type="number"
                          name="repeatEvery"
                          value={formData.repeatEvery}
                          onChange={handleChange}
                          min="1"
                          disabled={isEdit && editingSession?.editAllRecurring === false}
                        />
                        <span className="repeat-unit">
                          {formData.recurrenceType === 'daily' &&
                            formatMessage(messages['scheduleLiveSession.unit.days'])}
                          {formData.recurrenceType === 'weekly' &&
                            formatMessage(messages['scheduleLiveSession.unit.weeks'])}
                          {formData.recurrenceType === 'monthly' &&
                            formatMessage(messages['scheduleLiveSession.unit.months'])}
                        </span>
                      </div>
                    </Form.Group>
                  </div>

                  {/* Weekly Days */}
                  {formData.recurrenceType === 'weekly' && (
                    <Form.Group className="mb-4">
                      <Form.Label>{formatMessage(messages['scheduleLiveSession.occursOn'])}</Form.Label>
                      <div className="weekly-days">
                        {['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map(day => (
                          <Form.Check
                            key={day}
                            type="checkbox"
                            label={formatMessage(messages[`scheduleLiveSession.day.${day}`])}
                            checked={formData.weeklyDays.includes(day)}
                            onChange={() => toggleWeeklyDay(day)}
                            disabled={isEdit && editingSession?.editAllRecurring === false}
                            className="checkbox"
                          />
                        ))}
                      </div>
                    </Form.Group>
                  )}

                  {/* Monthly Options */}
                  {formData.recurrenceType === 'monthly' && (
                    <Form.Group className="mb-4">
                      <Form.Label>{formatMessage(messages['scheduleLiveSession.occursOn'])}</Form.Label>
                      <div className="d-flex occursOn">
                        <div className="w-50">
                          <Form.Check
                            type="radio"
                            name="monthlyOption"
                            label={formatMessage(messages['scheduleLiveSession.onDayOfMonth'])}
                            checked={formData.monthlyOption === 1}
                            onChange={() => setFormData(p => ({ ...p, monthlyOption: 1 }))}
                            disabled={isEdit && editingSession?.editAllRecurring === false}
                            className="checkbox"
                          />
                          <Form.Control
                            type="number"
                            value={formData.monthlyDay}
                            onChange={e => setFormData(p => ({ ...p, monthlyDay: parseInt(e.target.value) || 1 }))}
                            min="1"
                            max="31"
                            disabled={isEdit && editingSession?.editAllRecurring === false || formData.monthlyOption !== 1}
                          />
                        </div>
                        <div className="w-50 monthly-option">
                          <Form.Check
                            type="radio"
                            name="monthlyOption"
                            label={formatMessage(messages['scheduleLiveSession.onThe'])}
                            checked={formData.monthlyOption === 2}
                            onChange={() => setFormData(p => ({ ...p, monthlyOption: 2 }))}
                            disabled={isEdit && editingSession?.editAllRecurring === false}
                            className="checkbox"
                          />
                          <div className="d-flex">
                            <Form.Control
                              as="select"
                              value={formData.monthlyWeek}
                              onChange={e => setFormData(p => ({ ...p, monthlyWeek: e.target.value }))}
                              disabled={isEdit && editingSession?.editAllRecurring === false || formData.monthlyOption !== 2}
                            >
                              <option value="first">{formatMessage(messages['scheduleLiveSession.month.first'])}</option>
                              <option value="second">{formatMessage(messages['scheduleLiveSession.month.second'])}</option>
                              <option value="third">{formatMessage(messages['scheduleLiveSession.month.third'])}</option>
                              <option value="fourth">{formatMessage(messages['scheduleLiveSession.month.fourth'])}</option>
                              <option value="last">{formatMessage(messages['scheduleLiveSession.month.last'])}</option>
                            </Form.Control>
                            <Form.Control
                              as="select"
                              value={formData.monthlyWeekday}
                              onChange={e => setFormData(p => ({ ...p, monthlyWeekday: e.target.value }))}
                              disabled={isEdit && editingSession?.editAllRecurring === false || formData.monthlyOption !== 2}
                            >
                              {['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((d) => (
                                <option key={d} value={d}>
                                  {d.charAt(0).toUpperCase() + d.slice(1)}
                                </option>
                              ))}
                            </Form.Control>
                          </div>
                        </div>
                      </div>
                    </Form.Group>
                  )}

                  {/* End Date */}
                  <Form.Group className="mb-4 w-50">
                    <Form.Label>
                      {formatMessage(messages['scheduleLiveSession.endDate'])} <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="datetime-local"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      min={minDateTime}
                      disabled={isEdit && editingSession?.editAllRecurring === false}
                    />
                    {errors.endDate && <Form.Text className="text-danger">{errors.endDate}</Form.Text>}
                  </Form.Group>
                </div>
              )}

              {/* Internal Attendees Transfer */}
              <Form.Group className="mb-5 attendee-transfer-container">
                <Form.Label>{formatMessage(messages['scheduleLiveSession.internalAttendees'])}</Form.Label>
                <div className="attendee-transfer">
                  <div className="d-flex">
                    <div className="w-50 mb-4 mb-lg-0">
                      <div className="panel-header">
                        {formatMessage(messages['scheduleLiveSession.available'])} ({filteredAvailable.length})
                      </div>
                      <Form.Control
                        type="text"
                        placeholder={formatMessage(messages['scheduleLiveSession.searchAvailable'])}
                        value={leftFilter}
                        onChange={(e) => setLeftFilter(e.target.value)}
                        className="search-input"
                      />
                      <div className="attendee-list">
                        {filteredAvailable.map(email => (
                          <div
                            key={email}
                            className={`attendee-item ${selectedAvailable.includes(email) ? 'selected' : ''}`}
                            onClick={() => toggleAvailableSelection(email)}
                          >
                            {email}
                          </div>
                        ))}
                      </div>
                      <Button variant="outline-primary" className="mt-3 w-100" onClick={handleChooseAll}>
                        {formatMessage(messages['scheduleLiveSession.chooseAll'])}
                      </Button>
                    </div>

                    <div className="d-flex flex-column align-items-center justify-content-center arrow-column p-5">
                      <Button
                        variant="outline-primary"
                        className="transfer-btn mb-3"
                        onClick={handleMoveRight}
                        disabled={selectedAvailable.length === 0}
                      >
                        <FontAwesomeIcon icon={faArrowRight} />
                      </Button>
                      <Button
                        variant="outline-primary"
                        className="transfer-btn"
                        onClick={handleMoveLeft}
                        disabled={selectedSelectedSide.length === 0}
                      >
                        <FontAwesomeIcon icon={faArrowLeft} />
                      </Button>
                    </div>

                    <div className="w-50">
                      <div className="panel-header">
                        {formatMessage(messages['scheduleLiveSession.selected'])} ({filteredSelected.length})
                      </div>
                      <Form.Control
                        type="text"
                        placeholder={formatMessage(messages['scheduleLiveSession.searchSelected'])}
                        value={rightFilter}
                        onChange={(e) => setRightFilter(e.target.value)}
                        className="search-input"
                      />
                      <div className="attendee-list">
                        {filteredSelected.map(email => (
                          <div
                            key={email}
                            className={`attendee-item ${selectedSelectedSide.includes(email) ? 'selected' : ''}`}
                            onClick={() => toggleSelectedSelection(email)}
                          >
                            {email}
                          </div>
                        ))}
                      </div>
                      <Button variant="outline-primary" className="mt-3 w-100" onClick={handleRemoveAll}>
                        {formatMessage(messages['scheduleLiveSession.removeAll'])}
                      </Button>
                    </div>
                  </div>
                </div>
                {errors.attendees && <Form.Text className="text-danger mt-3">{errors.attendees}</Form.Text>}
              </Form.Group>

              {/* External Attendees & Alternative Hosts */}
              <div className="d-flex mb-4 external-host-container">
                <div className="w-50">
                  <Form.Label>{formatMessage(messages['scheduleLiveSession.externalAttendees'])}</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="externalAttendees"
                    value={formData.externalAttendees}
                    onChange={handleChange}
                    placeholder={formatMessage(messages['scheduleLiveSession.placeholder.externalEmails'])}
                  />
                </div>
                <div className="w-50">
                  <Form.Label>{formatMessage(messages['scheduleLiveSession.alternativeHosts'])}</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="alternativeHosts"
                    value={formData.alternativeHosts}
                    onChange={handleChange}
                    placeholder={formatMessage(messages['scheduleLiveSession.placeholder.hostEmails'])}
                  />
                </div>
              </div>

              {/* Mute on Entry & Keep Video */}
              <div className="d-flex mb-4 muteOnEntry">
                <div className="w-50">
                  <Form.Check
                    type="checkbox"
                    label={formatMessage(messages['scheduleLiveSession.muteOnEntry'])}
                    name="muteOnEntry"
                    checked={formData.muteOnEntry}
                    onChange={handleChange}
                    className="checkbox"
                  />
                </div>
                <div className="w-50">
                  <Form.Check
                    type="checkbox"
                    label={formatMessage(messages['scheduleLiveSession.keepVideo'])}
                    name="keepVideo"
                    checked={formData.keepVideo}
                    onChange={handleChange}
                    className="checkbox"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons mt-4 pt-3 border-top">
                <Button variant="outline-primary" onClick={onBack} className="mr-3">
                  {formatMessage(messages['scheduleLiveSession.cancel'])}
                </Button>
                <Button variant="primary" className="text-white" type="submit" disabled={loading}>
                  {loading && <Spinner animation="border" size="sm" className="mr-2" />}
                  {loading
                    ? (isEdit
                        ? formatMessage(messages['scheduleLiveSession.updating'])
                        : formatMessage(messages['scheduleLiveSession.saving']))
                    : (isEdit
                        ? formatMessage(messages['scheduleLiveSession.update'])
                        : formatMessage(messages['scheduleLiveSession.save']))
                  }
                </Button>
              </div>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleLiveSessionForm;