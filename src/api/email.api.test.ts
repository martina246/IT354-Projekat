import { describe, it, expect, beforeEach, vi } from 'vitest'
import { sendEmail, sendTicketCreatedEmail, sendTicketStatusUpdateEmail } from './email.api'

const mockFetch = vi.fn()

describe('email.api', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch)
  })

  describe('sendEmail', () => {
    it('POSTs to email API with correct payload', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true } as Response)

      await sendEmail({
        to: 'user@example.com',
        subject: 'Test',
        htmlContent: '<p>Hello</p>',
      })

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3002/api/send-email',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: 'user@example.com',
            subject: 'Test',
            htmlContent: '<p>Hello</p>',
            textContent: undefined,
          }),
        })
      )
    })

    it('catches error when response is not ok (does not reject)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Server error' }),
      } as Response)

      await sendEmail({ to: 'x@x.com', subject: 'S', htmlContent: 'H' })
      expect(mockFetch).toHaveBeenCalled()
    })
  })

  describe('sendTicketCreatedEmail', () => {
    it('calls sendEmail with ticket-created subject and html', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true } as Response)

      await sendTicketCreatedEmail('u@x.com', 'John Doe', 'My Ticket', 't-1')

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3002/api/send-email',
        expect.objectContaining({
          body: expect.stringContaining('New Ticket Created: My Ticket'),
        })
      )
      const body = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(body.htmlContent).toContain('t-1')
      expect(body.htmlContent).toContain('My Ticket')
      expect(body.htmlContent).toContain('John Doe')
    })
  })

  describe('sendTicketStatusUpdateEmail', () => {
    it('calls sendEmail with status update content', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true } as Response)

      await sendTicketStatusUpdateEmail('u@x.com', 'Jane', 'T2', 't-2', 'open', 'in_progress')

      const body = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(body.subject).toContain('Ticket Status Updated')
      expect(body.htmlContent).toContain('Open')
      expect(body.htmlContent).toContain('In progress')
    })
  })
})
