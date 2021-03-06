/*
 * Copyright (C) 2005-2012 BetaCONCEPT Limited
 *
 * This file is part of Astroboa.
 *
 * Astroboa is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Astroboa is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Astroboa.  If not, see <http://www.gnu.org/licenses/>.
 */
package org.betaconceptframework.astroboa.api.security.exception;

import org.betaconceptframework.astroboa.api.model.exception.CmsException;

/**
 * Thrown when Astroboa client has provided invalid permanent key.
 * .
 * @author Gregory Chomatas (gchomatas@betaconcept.com)
 * @author Savvas Triantafyllou (striantafyllou@betaconcept.com)
 * 
 */
public class CmsLoginInvalidPermanentKeyException extends CmsException{


	/**
	 * 
	 */
	private static final long serialVersionUID = -7372693150943736414L;

	public CmsLoginInvalidPermanentKeyException() {
		super();
	}

	public CmsLoginInvalidPermanentKeyException(String message, Throwable cause) {
		super(message, cause);
	}

	public CmsLoginInvalidPermanentKeyException(String string) {
		super(string);
	}

	public CmsLoginInvalidPermanentKeyException(Throwable e) {
		super(e);
	}


}
