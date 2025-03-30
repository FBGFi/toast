const defaultTimeout = 2000;

export class ToastProvider {
  /**
   * @type {Array<HTMLDivElement>}
   */
  static _messageQueue = [];
  /**
   * @type {HTMLDivElement | undefined}
   */
  static _messageContainer;

  static _pop(element) {
    element.remove();
    ToastProvider._messageQueue = ToastProvider._messageQueue.filter((e) => document.body.contains(e));
    if (!ToastProvider._messageQueue.length) {
      ToastProvider._messageContainer.remove();
      ToastProvider._messageContainer = undefined;
    }
  }

  static _push(element) {
    if (!ToastProvider._messageContainer) {
      ToastProvider._messageContainer = document.createElement("div");
      ToastProvider._messageContainer.id = "toast__container";
      document.body.appendChild(ToastProvider._messageContainer);
    }
    ToastProvider._messageContainer.appendChild(element);
    ToastProvider._messageQueue.push(element);
  }

  static _createWrapper({ className, ...attributes }, disposeOnClick) {
    const wrapper = document.createElement("div");
    const baseClassName = "toast__wrapper";
    const wrapperClass = className ? `${baseClassName} ${className}` : baseClassName;
    wrapper.className = wrapperClass;

    Object.entries(attributes).forEach(([key, value]) => {
      wrapper.setAttribute(key, value);
    });

    if (disposeOnClick) {
      wrapper.addEventListener("click", () => ToastProvider._pop(wrapper));
    }

    return wrapper;
  }

  static _createHeader(wrapper, content, disposeOnClick) {
    const header = document.createElement("div");
    header.className = "toast__header";
    const headerContent = document.createElement("div");
    headerContent.className = "toast__header-content";
    if (content) {
      if (typeof content === "string") {
        const textContainer = document.createElement("div");
        textContainer.innerHTML = content;
        headerContent.appendChild(textContainer);
      } else {
        headerContent.appendChild(content);
      }
    }
    header.appendChild(headerContent);
    if (!disposeOnClick) {
      const closeButton = document.createElement("button");
      closeButton.className = "toast__close";
      closeButton.addEventListener("click", () => ToastProvider._pop(wrapper));
      header.appendChild(closeButton);
    }
    wrapper.appendChild(header);
    return header;
  }

  static _createBody(wrapper, content) {
    const body = document.createElement("div");
    body.className = "toast__content";
    if (content) {
      if (typeof content === "string") {
        const textContainer = document.createElement("div");
        textContainer.innerHTML = content;
        body.appendChild(textContainer);
      } else {
        body.appendChild(content);
      }
    }
    wrapper.appendChild(body);
    return body;
  }

  /**
   * Create a toast element
   * @param {Object} args
   * @param {Element | string | undefined} args.header - Element or text to be shown in header.
   * @param {number | undefined} args.timeOut - Time that the toast is visible, set to 0 to disable. Default is 2s.
   * @param {Element | string} args.message - Element or text to be shown in the body.
   * @param {HTMLElement.attributes | undefined} args.attributes - Extra attributes to be added to the wrapper element (Note that class has to be defined as className).
   * @param {boolean | undefined} args.disposeOnClick - Add onclick listener to the element that disposes it.
   */
  static create({
    header,
    timeOut = defaultTimeout,
    message,
    attributes = {},
    disposeOnClick
  }) {
    const wrapper = ToastProvider._createWrapper(attributes, disposeOnClick);
    ToastProvider._createHeader(wrapper, header, disposeOnClick);
    ToastProvider._createBody(wrapper, message);
    ToastProvider._push(wrapper);
    if (timeOut) {
      setTimeout(() => ToastProvider._pop(wrapper), timeOut);
    }
  }
}
